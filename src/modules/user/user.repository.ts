import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserResponseDto, UserWithPasswordResponseDto } from "./dto/response.dto";
import { UserInclude } from "./consts/include";
import { UserCreateDto } from "./dto/create.dto";
import { UserSearchDto } from "./dto/search.dto";
import { mapSort } from "@app/tools/map.sort";
import { mapSearch } from "@app/tools/map.search";
import { mapPagination } from "@app/tools/map.pagination";

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

    async search(dto: UserSearchDto) {
        return this.prisma.user.findMany({
            where: mapSearch(dto.filters, [], [], dto.query, ["username", "firstName", "lastName"]),
            orderBy: mapSort(dto.sorts, []),
            ...mapPagination(dto.pagination),
            ...UserInclude
        });
    }

    async count(dto: UserSearchDto) {
        return this.prisma.user.count({
            where: mapSearch(dto.filters, [], [], dto.query, ["username", "firstName", "lastName"])
        });
    }
}
