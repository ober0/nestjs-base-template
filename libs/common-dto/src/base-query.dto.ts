import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";


export class QueryBaseDto {
    @ApiProperty({type: Number})
    @IsNumber()
    page: number;

    @ApiProperty({type: Number})
    @IsNumber()
    take: number;

    @ApiProperty({
        required: false,
        description: "Полнотекстовый поиск",
    })
    @IsOptional()
    @IsString()
    q?: string;

    @ApiPropertyOptional({
        type: [String],
        description: "Множественная сортировка в формате field:direction",
        example: ["createdAt:desc"]
    })
    @IsOptional()
    sort?: string[];
}



