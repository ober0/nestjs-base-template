import { PrismaClient } from "@prisma/client";
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
