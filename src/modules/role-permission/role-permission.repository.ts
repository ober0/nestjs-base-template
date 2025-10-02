import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RolePermissionIncludePermissionDto } from "./dto/base.dto";

@Injectable()
export class RolePermissionRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findPermissionsByRole(roleId: number): Promise<RolePermissionIncludePermissionDto[]> {
        return this.prisma.rolePermission.findMany({
            where: { roleId },
            include: { permission: true }
        });
    }
}
