import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserBaseDto } from "../../user/dto/base.dto";

export const DecodeUser = createParamDecorator((data: unknown, context: ExecutionContext): UserBaseDto => {
    return context.switchToHttp().getRequest().user;
});
