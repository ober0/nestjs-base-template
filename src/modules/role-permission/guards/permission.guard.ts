import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolePermissionService } from "../role-permission.service";
import { PermissionEnum } from "../../permission/enum/permissions.enum";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly rolesPermissionsService: RolePermissionService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<PermissionEnum[]>("user:permissions", [
            context.getHandler(),
            context.getClass()
        ]);
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();

        await this.checkPermissions(requiredPermissions, user.id);

        return true;
    }

    private async checkPermissions(requiredPermissions: PermissionEnum[], userId: number): Promise<void> {
        const permissionsCheckResults = await Promise.all(
            requiredPermissions.map((permission) =>
                this.rolesPermissionsService.checkUserPermission(permission, userId)
            )
        );
        const res = permissionsCheckResults.every((result) => result);

        if (!res) {
            throw new ForbiddenException("Недостаточно прав для данного действия");
        }
    }
}
