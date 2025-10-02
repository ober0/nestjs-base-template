import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { RoleRepository } from "./role.repository";
import { RoleCreateDto } from "./dto/create.dto";
import { RoleResponseDto } from "./dto/response.dto";
import { PermissionService } from "../permission/permission.service";
import { RolePermissionIncludePermissionDto } from "../role-permission/dto/base.dto";
import { RoleUpdateDto } from "./dto/update.dto";

@Injectable()
export class RoleService {
    constructor(
        private readonly repository: RoleRepository,
        private readonly permissionService: PermissionService
    ) {}

    async findRoleByName(name: string) {
        return this.repository.findRoleByName(name);
    }

    async create(dto: RoleCreateDto): Promise<RoleResponseDto> {
        const role = await this.findRoleByName(dto.name);
        if (role) {
            throw new BadRequestException(`Роль ${dto.name} уже существует`);
        }

        await Promise.all(
            dto.permissionIds.map(async (permissionId) => {
                await this.permissionService.findOneById(permissionId);
            })
        );

        const data = await this.repository.create(dto);

        return this.transformData(data);
    }

    private transformData(
        data: Omit<RoleResponseDto, "permission"> & { rolePermissions: RolePermissionIncludePermissionDto[] }
    ): RoleResponseDto {
        return {
            id: data.id,
            createdAt: data.createdAt,
            name: data.name,
            permission: data.rolePermissions.map((el) => el.permission)
        };
    }

    async update(id: number, dto: RoleUpdateDto): Promise<RoleResponseDto> {
        await this.findRoleById(id);

        if (dto.name) {
            const role = await this.findRoleByName(dto.name);
            if (role) {
                throw new BadRequestException(`Роль ${dto.name} уже существует`);
            }
        }

        if (dto.permissionIds) {
            await Promise.all(
                dto.permissionIds.map(async (permissionId) => {
                    await this.permissionService.findOneById(permissionId);
                })
            );
        }

        const data = await this.repository.update(id, dto);

        return this.transformData(data);
    }

    async delete(id: number) {
        await this.findRoleById(id);

        const data = await this.repository.delete(id);

        return this.transformData(data);
    }

    async findRoleById(id: number) {
        const data = await this.repository.findRoleById(id);
        if (!data) {
            throw new NotFoundException();
        }
        return this.transformData(data);
    }

    async getAll(query?: string): Promise<RoleResponseDto[]> {
        const data = await this.repository.getAll(query);

        return data.map((el) => this.transformData(el));
    }
}
