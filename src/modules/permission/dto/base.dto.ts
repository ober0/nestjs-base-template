import { IsDate, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PermissionBaseDto {
    @ApiProperty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsDate()
    createdAt: Date;
}
