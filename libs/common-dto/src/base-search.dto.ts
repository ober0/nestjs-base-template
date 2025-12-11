import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested, IsObject, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "./pagination.dto";
import { Transform, Type } from "class-transformer";

export function GenerateSearchDto<T extends object, I extends object>(
    FilterClass: new () => T,
    SortClass: new () => I
) {
    class SearchBaseDto {
        @ApiProperty({ required: false, type: FilterClass })
        @ValidateNested()
        @IsOptional()
        @Type(() => FilterClass)
        filters?: T;

        @ApiProperty({ type: PaginationDto })
        @ValidateNested()
        @Type(() => PaginationDto)
        @IsObject()
        @IsOptional()
        pagination?: PaginationDto;

        @ApiProperty({ required: false, description: "Общий поиск" })
        @IsString()
        @IsOptional()
        query?: string;

        @ApiProperty({ required: false, type: SortClass })
        @ValidateNested()
        @Type(() => SortClass)
        @IsOptional()
        sorts?: I;
    }

    return SearchBaseDto;
}
