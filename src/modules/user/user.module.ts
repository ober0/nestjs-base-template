import { Global, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { UserController } from "./user.controller";
import { RoleModule } from "../role/role.module";

@Global()
@Module({
    imports: [RoleModule],
    providers: [UserService, UserRepository],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}
