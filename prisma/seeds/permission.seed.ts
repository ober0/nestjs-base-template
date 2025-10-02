import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { RoleNames } from "../../src/modules/role/enum/base-roles";
import { PermissionDescription, PermissionEnum } from "../../src/modules/permission/enum/permissions.enum";

export async function permissionRole(prisma: PrismaClient) {
    for (const name of Object.keys(PermissionEnum)) {
        await prisma.permission.upsert({
            where: {
                name
            },
            update: {
                description: PermissionDescription[name]
            },
            create: {
                name,
                description: PermissionDescription[name]
            }
        });
    }
}
