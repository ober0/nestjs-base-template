import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class QueryBaseDto {
    @ApiProperty()
    page: number;

    @ApiProperty()
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



