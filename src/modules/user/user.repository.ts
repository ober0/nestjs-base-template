import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserResponseDto, UserWithPasswordResponseDto } from "./dto/response.dto";
import { UserInclude } from "./consts/include";
import { UserCreateDto } from "./dto/create.dto";

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findOneById(id: number): Promise<UserResponseDto | null> {
        return this.prisma.user.findUnique({
            where: { id },
            ...UserInclude,
            omit: { password: true }
        });
    }

    async findOneByUsername(username: string): Promise<UserResponseDto | null> {
        return this.prisma.user.findUnique({
            where: { username },
            ...UserInclude,
            omit: { password: true }
        });
    }

    async create(dto: UserCreateDto): Promise<UserResponseDto> {
        return this.prisma.user.create({
            data: {
                password: dto.password,
                username: dto.username,
                role: {
                    connect: {
                        id: dto.roleId
                    }
                },
                email: dto.email,
                firstName: dto.firstName,
                lastName: dto.lastName,
                telegram: dto.telegram
            },
            ...UserInclude,
            omit: { password: true }
        });
    }

    async findOneByUsernameWithPassword(username: string): Promise<UserWithPasswordResponseDto | null> {
        return this.prisma.user.findUnique({
            where: { username },
            ...UserInclude
        });
    }
}
