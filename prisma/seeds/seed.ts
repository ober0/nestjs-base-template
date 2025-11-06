import { PrismaClient } from "@prisma/client";
import { userSeed } from "./user.seed";
import { roleSeed } from "./role.seed";
import { permissionRole } from "./permission.seed";
import { rolePermissionSeed } from "./role-permission.seed";
import { sportSeed } from "./sport.seed";
import { serviceSettingsSeed } from "./service-settings.seed";

const prisma = new PrismaClient();

async function main() {
    await permissionRole(prisma);
    console.log("[+] Разрешения созданы");

    await roleSeed(prisma);
    console.log("[+] Роли созданы");

    await rolePermissionSeed(prisma);
    console.log("[+] Связь ролей и разрешений создана");

    await userSeed(prisma);
    console.log("[+] Пользователи созданы");

    await sportSeed(prisma);
    console.log("[+] Типы спорта и их исходы созданы");

    await serviceSettingsSeed(prisma);
    console.log("[+] Настройки сервиса");

    console.log("[+] Все готово");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
