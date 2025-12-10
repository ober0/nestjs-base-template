import { DateMinMaxFilterDto } from "@app/common-dto/min-max.filter.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional } from "class-validator";
import { IsDateString } from "class-validator";
import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";
import { NumberMinMaxFilterDto } from "@app/common-dto/min-max.filter.dto";
import { QueryBaseDto } from "@app/common-dto/base-query.dto";
import { IntersectionType } from "@nestjs/swagger";
import { PartialType } from "@nestjs/swagger";
import { log } from "console";

export function GenerateQueryDto<T extends object>(dto: new () => T) {
    class ModifiedDto {}

    const dtoInstance = new dto();
    for (const key of Object.keys(dtoInstance)) {
        const propertyType = Reflect.getMetadata("design:type", dto.prototype, key);

        if (propertyType === DateMinMaxFilterDto) {
            Object.defineProperty(ModifiedDto.prototype, `${key}[min]`, {
                value: undefined,
                writable: true,
                enumerable: true,
                configurable: true
            });
            ApiPropertyOptional({ type: Date })(ModifiedDto.prototype, `${key}[min]`);
            IsOptional()(ModifiedDto.prototype, `${key}[min]`);
            Type(() => Date)(ModifiedDto.prototype, `${key}[min]`);
            IsDate()(ModifiedDto.prototype, `${key}[min]`);
        

            Object.defineProperty(ModifiedDto.prototype, `${key}[max]`, {
                value: undefined,
                writable: true,
                enumerable: true,
                configurable: true
            });
            ApiPropertyOptional({ type: Date })(ModifiedDto.prototype, `${key}[max]`);
            IsOptional()(ModifiedDto.prototype, `${key}[max]`);
            Type(() => Date)(ModifiedDto.prototype, `${key}[max]`);
            IsDate()(ModifiedDto.prototype, `${key}[max]`);
            Transform(({ value }) => new Date(value))(ModifiedDto.prototype, `${key}[max]`);
        } else if (propertyType === NumberMinMaxFilterDto) {
            Object.defineProperty(ModifiedDto.prototype, `${key}[min]`, {
                value: undefined,
                writable: true,
                enumerable: true,
                configurable: true
            });
            ApiPropertyOptional({ type: Number })(ModifiedDto.prototype, `${key}[min]`);
            Type(() => Number)(ModifiedDto.prototype, `${key}[min]`);
            IsOptional()(ModifiedDto.prototype, `${key}[min]`);
            IsNumber()(ModifiedDto.prototype, `${key}[min]`);

            Object.defineProperty(ModifiedDto.prototype, `${key}Max`, {
                value: undefined,
                writable: true,
                enumerable: true,
                configurable: true
            });
            ApiPropertyOptional({ type: Number })(ModifiedDto.prototype, `${key}[max]`);
            Type(() => Number)(ModifiedDto.prototype, `${key}[max]`);
            IsOptional()(ModifiedDto.prototype, `${key}[max]`);
            IsNumber()(ModifiedDto.prototype, `${key}[max]`);
        } else if (propertyType === Array) {
            Object.defineProperty(ModifiedDto.prototype, key, {
                value: undefined,
                writable: true,
                enumerable: true,
                configurable: true
            });
            ApiPropertyOptional({ type: propertyType, example: ["valueHere"] })(ModifiedDto.prototype, key);
            Type(() => Array<string>)(ModifiedDto.prototype, `${key}`);
            IsOptional()(ModifiedDto.prototype, key);
        } else {
            Object.defineProperty(ModifiedDto.prototype, key, {
                value: undefined,
                writable: true,
                enumerable: true,
                configurable: true
            });
            ApiPropertyOptional({ type: propertyType })(ModifiedDto.prototype, key);
            IsOptional()(ModifiedDto.prototype, key);
        }
    }

    return IntersectionType(QueryBaseDto, PartialType(ModifiedDto));
}
