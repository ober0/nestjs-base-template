import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { RoleNames } from "../../src/modules/role/enum/base-roles";
import { PermissionEnum } from "../../src/modules/permission/enum/permissions.enum";

const rolePermissions: Record<RoleNames, PermissionEnum[]> = {
    [RoleNames.Admin]: Object.values(PermissionEnum),
    [RoleNames.User]: []
};

export async function rolePermissionSeed(prisma: PrismaClient) {
    await prisma.rolePermission.deleteMany();

    for (const [roleName, permission] of Object.entries(rolePermissions)) {
        const role = await prisma.role.findUnique({
            where: {
                name: roleName
            }
        });
        const permissions = await prisma.permission.findMany({
            where: {
                name: {
                    in: permission
                }
            }
        });

        if (!role) {
            throw new Error(`Не создана роль ${roleName}`);
        }

        await prisma.rolePermission.createMany({
            data: permissions.map((el) => {
                return {
                    permissionId: el.id,
                    roleId: role.id
                };
            })
        });
    }
}
