import { Injectable, NotFoundException } from "@nestjs/common";
import { RolePermissionRepository } from "./role-permission.repository";
import { UserService } from "../user/user.service";
import { PermissionEnum } from "../permission/enum/permissions.enum";
import { RolePermissionIncludePermissionDto } from "./dto/base.dto";

@Injectable()
export class RolePermissionService {
    constructor(
        private readonly rolePermissionRepository: RolePermissionRepository,
        private readonly userService: UserService
    ) {}

    async checkUserPermission(permission: PermissionEnum, userId: number) {
        const userRoleId = await this.getUserRoleUuid(userId);

        const existPermissions: RolePermissionIncludePermissionDto[] =
            await this.rolePermissionRepository.findPermissionsByRole(userRoleId);

        return existPermissions.some((existPermission) => existPermission.permission.name === permission.toString());
    }

    private async getUserRoleUuid(userId: number) {
        const user = await this.userService.findOneById(userId);
        if (!user) {
            throw new NotFoundException("Пользователь не найден");
        }
        return user.roleId;
    }
}
