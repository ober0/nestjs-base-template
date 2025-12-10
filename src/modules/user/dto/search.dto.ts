import { ApiProperty, ApiPropertyOptional, IntersectionType, PartialType } from "@nestjs/swagger";
import { IsArray, IsEmail, IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { DateMinMaxFilterDto } from "@app/common-dto/min-max.filter.dto";
import { SortTypes } from "@app/common-dto/sort-types.dto";
import { SearchBaseDto } from "@app/common-dto/base-search.dto";
import { GenerateQueryDto } from "@app/tools/generate-query.func";

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
    roleIds?: string[];
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

export class UserSearchDto extends SearchBaseDto<UserFiltersDto, UserSortDto> {}

export class UserQuerySearchDto extends GenerateQueryDto(UserFiltersDto) {
}
