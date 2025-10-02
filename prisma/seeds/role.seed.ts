import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { RoleNames } from "../../src/modules/role/enum/base-roles";

export async function roleSeed(prisma: PrismaClient) {
    for (const name of Object.keys(RoleNames)) {
        await prisma.role.upsert({
            where: {
                name
            },
            update: {},
            create: {
                name
            }
        });
    }
}
