import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";
import { RoleModule } from "../role/role.module";
import { PermissionModule } from "../permission/permission.module";
import { RolePermissionModule } from "../role-permission/role-permission.module";
import { CryptModule } from "../crypt/crypt.module";
import { RedisModule } from "../redis/redis.module";
import { LoggerMiddleware } from "../../../libs/middlewares/logger.middleware";

@Module({
    imports: [
        PrismaModule,
        ConfigModule.forRoot({ isGlobal: true }),
        UserModule,
        AuthModule,
        RoleModule,
        PermissionModule,
        RolePermissionModule,
        CryptModule,
        RedisModule
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes("*path");
    }
}
