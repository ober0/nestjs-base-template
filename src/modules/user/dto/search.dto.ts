import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { DateMinMaxFilterDto } from "@app/common-dto/min-max.filter.dto";
import { SortTypes } from "@app/common-dto/sort-types.dto";
import { GenerateQueryDto } from "@app/tools/generate-query.func";
import { GenerateSearchDto } from "@app/common-dto/base-search.dto";

export class UserFiltersDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty()
    @IsOptional()
    @ValidateNested()
    @Type(() => DateMinMaxFilterDto)
    createdAt?: DateMinMaxFilterDto;

    @ApiPropertyOptional({
        type: [Number],
        example: [1]
    })
    @IsOptional()
    @IsNumber({}, { each: true })
    roleIds?: number[];
}

export class UserSortDto {
    @ApiProperty()
    @IsOptional()
    @IsEnum(SortTypes)
    createdAt?: SortTypes;

    @ApiProperty()
    @IsOptional()
    @IsEnum(SortTypes)
    username?: SortTypes;
}

export class UserSearchDto extends GenerateSearchDto(UserFiltersDto, UserSortDto) {}

export class UserQuerySearchDto extends GenerateQueryDto(UserFiltersDto) {}
