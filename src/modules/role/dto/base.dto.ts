import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsString } from "class-validator";
export class RoleBaseDto {
    @ApiProperty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsDate()
    createdAt: Date;
}
