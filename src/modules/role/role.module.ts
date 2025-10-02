import { Module } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleRepository } from "./role.repository";
import { RoleController } from './role.controller';

@Module({
    providers: [RoleService, RoleRepository],
    exports: [RoleService],
    controllers: [RoleController]
})
export class RoleModule {}
