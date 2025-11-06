import { PrismaClient } from "@prisma/client";
import { ServiceSettingsJsonDto } from "../../src/modules/service-settings/dto/settings-json.dto";

export async function serviceSettingsSeed(prisma: PrismaClient) {
    const count = await prisma.serviceSettings.count();

    if (count === 0) {
        const settings: ServiceSettingsJsonDto = {
            allowPhoneRegistration: true
        };

        await prisma.serviceSettings.create({
            data: {
                json: JSON.parse(JSON.stringify(settings))
            }
        });
    }
}
