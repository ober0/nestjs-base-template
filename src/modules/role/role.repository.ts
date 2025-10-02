import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RoleCreateDto } from "./dto/create.dto";
import { RoleInclude } from "./const/include.const";
import { RoleResponseDto } from "./dto/response.dto";
import { RoleUpdateDto } from "./dto/update.dto";

@Injectable()
export class RoleRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findRoleByName(name: string) {
        return this.prisma.role.findUnique({
            where: { name }
        });
    }

    async create(dto: RoleCreateDto) {
        return this.prisma.role.create({
            data: {
                name: dto.name,
                rolePermissions: dto.permissionIds.length
                    ? {
                          create: dto.permissionIds.map((permissionId) => ({
                              permissionId
                          }))
                      }
                    : undefined
            },
            ...RoleInclude
        });
    }

    async update(id: number, dto: RoleUpdateDto) {
        return this.prisma.role.update({
            where: { id },
            data: {
                name: dto.name,
                rolePermissions: dto.permissionIds?.length
                    ? {
                          create: dto.permissionIds.map((permissionId) => ({
                              permissionId
                          }))
                      }
                    : undefined
            },
            ...RoleInclude
        });
    }

    async findRoleById(id: number) {
        return this.prisma.role.findUnique({
            where: { id },
            ...RoleInclude
        });
    }

    async delete(id: number) {
        return this.prisma.role.delete({
            where: { id },
            ...RoleInclude
        });
    }

    async getAll(query?: string) {
        return this.prisma.role.findMany({
            where: query
                ? {
                      name: {
                          contains: query,
                          mode: "insensitive"
                      }
                  }
                : undefined,
            ...RoleInclude
        });
    }
}
