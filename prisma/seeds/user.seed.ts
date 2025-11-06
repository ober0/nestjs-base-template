import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { RoleNames } from "../../src/modules/role/enum/base-roles";
import { LanguageEnum, ThemeEnum } from "../../src/modules/user-settings/dto/settings-json.dto";

const salt = process.env.SALT_ROUNDS;
if (!salt) {
    throw new Error("SALT_ROUNDS не указана в енвах");
}

async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, Number(salt));
}

async function createAdmin(prisma: PrismaClient) {
    const role = await prisma.role.findUnique({
        where: {
            name: RoleNames.Admin
        }
    });
    if (!role) {
        throw new Error("Роль admin не найдена в бд");
    }

    const phoneNumber = process.env.BASE_ADMIN_PHONE;
    const password = process.env.BASE_ADMIN_PASSWORD;

    if (!phoneNumber || !password) {
        throw new Error("В env не указаны данные для администратора");
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.upsert({
        where: {
            phoneNumber
        },
        create: {
            phoneNumber,
            settings: {
                create: {
                    json: {
                        theme: ThemeEnum.Light,
                        language: LanguageEnum.Ru,
                        notifications: {
                            coefficientChange: false,
                            matchStart: true,
                            requestLimit: true
                        }
                    }
                }
            },
            userInfo: {
                create: {
                    accuracyPercent: 0,
                    forecastCount: 0,
                    profitPercent: 0
                }
            },
            nickname: "admin",
            person: {
                create: {
                    firstName: "Администратор",
                    lastName: "Системы",
                    dateOfBirthday: new Date("2002-10-11")
                }
            },
            password: {
                create: {
                    password: passwordHash
                }
            },
            role: {
                connect: {
                    uuid: role.uuid
                }
            },
            email: "string@gmail.com"
        },
        update: {
            email: "string@gmail.com"
        }
    });
}

export async function userSeed(prisma: PrismaClient) {
    await createAdmin(prisma);
}
