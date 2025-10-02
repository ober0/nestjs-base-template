import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PermissionRepository } from "./permission.repository";
import { PermissionBaseDto } from "./dto/base.dto";

@Injectable()
export class PermissionService {
    constructor(private readonly permissionRepository: PermissionRepository) {}

    async findAll(query?: string): Promise<PermissionBaseDto[]> {
        return this.permissionRepository.findAll(query);
    }

    async findOneById(id: number): Promise<PermissionBaseDto> {
        const permission: PermissionBaseDto | null = await this.permissionRepository.findOne(id);
        if (!permission) {
            throw new NotFoundException("Право не найдено");
        }
        return permission;
    }

    async isExists(ids: number[] | number): Promise<boolean> {
        if (typeof ids === "number") {
            ids = [ids];
        }
        const data = await this.findAll();
        const existIds = data.map((item) => item.id);
        return ids.every((id) => existIds.includes(id));
    }
}
