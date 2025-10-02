import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiQuery, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { PermissionService } from "./permission.service";
import { PermissionBaseDto } from "./dto/base.dto";
import { JwtAuthGuardHttp } from "../auth/guards/auth.guard";
import { PermissionGuard } from "../role-permission/guards/permission.guard";
import { HasPermissions } from "../role-permission/decorators/permissions.decorator";
import { PermissionEnum } from "./enum/permissions.enum";

@ApiTags("Permission")
@Controller("permission")
@ApiSecurity("bearer")
@UseGuards(JwtAuthGuardHttp, PermissionGuard)
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Get()
    @ApiOperation({ summary: "Получение всех прав" })
    @ApiOkResponse({ type: PermissionBaseDto, isArray: true })
    @ApiQuery({
        name: "query",
        type: String,
        required: false,
        description: "Поиск"
    })
    @HasPermissions(PermissionEnum.PermissionsGetMany)
    async findAll(@Query("query") query?: string): Promise<PermissionBaseDto[]> {
        return this.permissionService.findAll(query);
    }

    @Get(":id")
    @ApiOperation({ summary: "Получение одного права" })
    @ApiOkResponse({ type: PermissionBaseDto })
    @HasPermissions(PermissionEnum.PermissionsGetOne)
    async findOne(@Param("id", ParseIntPipe) id: number): Promise<PermissionBaseDto> {
        return this.permissionService.findOneById(id);
    }
}
