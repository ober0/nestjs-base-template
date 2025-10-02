import { IsNumber, IsOptional, IsUUID } from "class-validator";
import { UserBaseDto } from "./base.dto";
import { ApiProperty, OmitType } from "@nestjs/swagger";

export class UserCreateDto extends OmitType(UserBaseDto, ["id", "role", "roleId"]) {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    roleId: number;
}
