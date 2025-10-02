import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { IsTelegramUsername } from "@app/decorators/class-validator/is-telegram-username";
import { RoleBaseDto } from "../../role/dto/base.dto";

export class UserBaseDto {
    @ApiProperty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiProperty({ type: String })
    @IsOptional()
    @IsTelegramUsername()
    telegram?: string | null;

    @ApiProperty({ type: String })
    @IsOptional()
    @IsEmail()
    email?: string | null;

    @ApiProperty()
    @IsNumber()
    roleId: number;

    @ApiProperty({ type: RoleBaseDto })
    @ValidateNested()
    @Type(() => RoleBaseDto)
    role: RoleBaseDto;
}
