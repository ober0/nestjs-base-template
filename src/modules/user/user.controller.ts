import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuardHttp } from "../auth/guards/auth.guard";
import { DecodeUser } from "../auth/decorators/decode-user.decorator";
import { UserResponseDto, UserSearchResponseDto } from "./dto/response.dto";
import { UserBaseDto } from "./dto/base.dto";
import { UserCreateDto } from "./dto/create.dto";
import { PermissionGuard } from "../role-permission/guards/permission.guard";
import { HasPermissions } from "../role-permission/decorators/permissions.decorator";
import { PermissionEnum } from "../permission/enum/permissions.enum";
import { SearchQuery } from "@app/decorators/search-query.decorator";
import { UserQuerySearchDto, UserSearchDto } from "./dto/search.dto";

@ApiTags("User")
@Controller("user")
@ApiSecurity("bearer")
@UseGuards(JwtAuthGuardHttp)
export class UserController {
    constructor(private readonly service: UserService) {}

    @ApiOperation({ summary: "Получить информацию о себе" })
    @ApiOkResponse({ type: UserResponseDto })
    @Get("self")
    async findOne(@DecodeUser() user: UserBaseDto): Promise<UserResponseDto> {
        return this.service.findOneById(user.id);
    }

    @ApiOperation({ summary: "Создание пользователя" })
    @ApiCreatedResponse({ type: UserResponseDto })
    @Post()
    @UseGuards(PermissionGuard)
    @HasPermissions(PermissionEnum.CreateUser)
    async create(@Body() registerDto: UserCreateDto): Promise<UserResponseDto> {
        return this.service.register(registerDto);
    }

    @ApiOperation({ summary: "Поиск" })
    @ApiOkResponse({ type: UserSearchResponseDto })
    @Get("search")
    @UseGuards(PermissionGuard)
    @ApiQuery({ type: UserQuerySearchDto })
    @HasPermissions(PermissionEnum.SearchUser)
    async search(@SearchQuery(UserSearchDto) dto: UserSearchDto): Promise<UserSearchResponseDto | void> {
        console.log(dto);
    }
}
