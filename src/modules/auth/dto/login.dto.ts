import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { UserResponseDto } from "../../user/dto/response.dto";
import { TokenBaseDto } from "./tokens.dto";

export class LoginDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;
}

export class LoginResponseDto extends TokenBaseDto {
    @ApiProperty()
    @ValidateNested()
    @Type(() => UserResponseDto)
    user: UserResponseDto;
}

export class LoginControllerResponseDto extends OmitType(LoginResponseDto, ["refreshToken"]) {}
