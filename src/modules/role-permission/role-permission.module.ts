import { forwardRef, Global, Module } from "@nestjs/common";
import { RolePermissionService } from "./role-permission.service";
import { PrismaService } from "../prisma/prisma.service";
import { UserModule } from "../user/user.module";
import { RolePermissionRepository } from "./role-permission.repository";

@Global()
@Module({
    providers: [RolePermissionService, RolePermissionRepository],
    exports: [RolePermissionService]
})
export class RolePermissionModule {}
