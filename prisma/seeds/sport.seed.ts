import { PrismaClient } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";

const sportsData = [
    {
        name: { ru: "Футбол", en: "Football" } as InputJsonValue,
        availableExodus: [
            { name: { ru: "П1", en: "P1" } as InputJsonValue },
            { name: { ru: "П2", en: "P2" } as InputJsonValue },
            { name: { ru: "Х", en: "X" } as InputJsonValue }
        ]
    },
    {
        name: { ru: "Волейбол", en: "Volleyball" } as InputJsonValue,
        availableExodus: [
            { name: { ru: "П1", en: "P1" } as InputJsonValue },
            { name: { ru: "П2", en: "P2" } as InputJsonValue },
            { name: { ru: "Х", en: "X" } as InputJsonValue }
        ]
    },
    {
        name: { ru: "Баскетбол", en: "Basketball" } as InputJsonValue,
        availableExodus: [
            { name: { ru: "П1", en: "P1" } as InputJsonValue },
            { name: { ru: "П2", en: "P2" } as InputJsonValue },
            { name: { ru: "Х", en: "X" } as InputJsonValue }
        ]
    }
];

export async function sportSeed(prisma: PrismaClient) {
    for (const sport of sportsData) {
        const existingSport = await prisma.sport.findFirst({
            where: {
                name: {
                    equals: sport.name
                }
            }
        });

        if (!existingSport) {
            await prisma.sport.create({
                data: {
                    name: sport.name,
                    availableExodus: {
                        create: sport.availableExodus
                    }
                }
            });
        }
    }
}
