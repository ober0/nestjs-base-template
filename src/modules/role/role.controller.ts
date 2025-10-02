import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuardHttp } from "../auth/guards/auth.guard";
import { RoleService } from "./role.service";
import { RoleCreateDto } from "./dto/create.dto";
import { RoleResponseDto } from "./dto/response.dto";
import { RoleUpdateDto } from "./dto/update.dto";
import { PermissionGuard } from "../role-permission/guards/permission.guard";
import { HasPermissions } from "../role-permission/decorators/permissions.decorator";
import { PermissionEnum } from "../permission/enum/permissions.enum";

@Controller("role")
@ApiTags("Role")
@ApiSecurity("bearer")
@UseGuards(JwtAuthGuardHttp, PermissionGuard)
export class RoleController {
    constructor(private readonly service: RoleService) {}

    @Post()
    @ApiCreatedResponse({ type: RoleResponseDto })
    @ApiOperation({ summary: "Создать роль" })
    @HasPermissions(PermissionEnum.RoleCreate)
    async create(@Body() dto: RoleCreateDto): Promise<RoleResponseDto> {
        return this.service.create(dto);
    }

    @Patch(":id")
    @ApiOkResponse({ type: RoleResponseDto })
    @ApiOperation({ summary: "Обновить роль" })
    @HasPermissions(PermissionEnum.RoleUpdate)
    async update(@Param("id", ParseIntPipe) id: number, @Body() dto: RoleUpdateDto): Promise<RoleResponseDto> {
        return this.service.update(id, dto);
    }

    @Delete(":id")
    @ApiOkResponse({ type: RoleResponseDto })
    @ApiOperation({ summary: "Удалить роль" })
    @HasPermissions(PermissionEnum.RoleDelete)
    async delete(@Param("id", ParseIntPipe) id: number): Promise<RoleResponseDto> {
        return this.service.delete(id);
    }

    @Get()
    @ApiOkResponse({ type: RoleResponseDto, isArray: true })
    @ApiOperation({ summary: "Поиск ролей" })
    @ApiQuery({
        name: "query",
        required: false,
        type: String,
        description: "Поиск"
    })
    @HasPermissions(PermissionEnum.RoleGetMany)
    async getAll(@Query("query") query?: string): Promise<RoleResponseDto[]> {
        return this.service.getAll(query);
    }

    @Get(":id")
    @ApiOkResponse({ type: RoleResponseDto })
    @ApiOperation({ summary: "Поиск роли по id" })
    @HasPermissions(PermissionEnum.RoleGetOne)
    async getById(@Query("id") id: number): Promise<RoleResponseDto> {
        return this.service.findRoleById(id);
    }
}
