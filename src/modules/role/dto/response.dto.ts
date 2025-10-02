import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";
import { IsDate, IsNumber, IsString, ValidateNested } from "class-validator";
import { RoleBaseDto } from "./base.dto";
import { PermissionBaseDto } from "../../permission/dto/base.dto";
import { Type } from "class-transformer";
export class RoleResponseDto extends RoleBaseDto {
    @ApiProperty({ type: PermissionBaseDto, isArray: true })
    @ValidateNested()
    @Type(() => PermissionBaseDto)
    permission: PermissionBaseDto[];
}
