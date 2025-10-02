import { RoleBaseDto } from "../../role/dto/base.dto";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNumber, ValidateNested } from "class-validator";
import { PermissionBaseDto } from "../../permission/dto/base.dto";

export class RolePermissionBaseDto {
    @ApiProperty({ type: RoleBaseDto })
    @ValidateNested()
    @Type(() => RoleBaseDto)
    role: RoleBaseDto;

    @ApiProperty({ type: PermissionBaseDto })
    @ValidateNested()
    @Type(() => PermissionBaseDto)
    permission: PermissionBaseDto;

    @ApiProperty()
    @IsNumber()
    roleId: number;

    @ApiProperty()
    @IsNumber()
    permissionId: number;

    @ApiProperty()
    @IsDate()
    createdAt: Date;
}

export class RolePermissionIncludePermissionDto extends OmitType(RolePermissionBaseDto, ["role"]) {}
export class RolePermissionIncludeRoleDto extends OmitType(RolePermissionBaseDto, ["permission"]) {}
