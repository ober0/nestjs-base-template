import { DateMinMaxFilterDto } from "@app/common-dto/min-max.filter.dto";
import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString, IsArray } from "class-validator";
import { IsDateString } from "class-validator";
import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";
import { NumberMinMaxFilterDto } from "@app/common-dto/min-max.filter.dto";
import { QueryBaseDto } from "@app/common-dto/base-query.dto";
import { IntersectionType } from "@nestjs/swagger";

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
            const swaggerMetadata = Reflect.getMetadata("swagger/apiModelProperties", dto.prototype, key);

            const arrayType = swaggerMetadata.type ?? String;

            Object.defineProperty(ModifiedDto.prototype, key, {
                value: undefined,
                writable: true,
                enumerable: true,
                configurable: true
            });
            ApiPropertyOptional({ type: propertyType, example: ["valueHere"] })(ModifiedDto.prototype, key);
            Transform(({ value }) => {
                if (Array.isArray(value)) {
                    if (arrayType === Number) {
                        return value.map((el) => {
                            return parseInt(el);
                        });
                    }
                    return value;
                } else if (typeof value === "string") {
                    const splited = value.replace(/,\s+/g, ",").split(",");
                    if (splited.length > 1) {
                        if (arrayType === Number) {
                            return splited.map((el) => parseInt(el));
                        }
                        return splited;
                    }
                    if (arrayType === String) {
                        return [value];
                    }
                    const numberValue = parseInt(value);
                    return [numberValue];
                }
                return value;
            })(ModifiedDto.prototype, key);
            IsOptional()(ModifiedDto.prototype, key);
            IsArray()(ModifiedDto.prototype, key);

            if (arrayType === Number) {
                IsNumber({}, { each: true })(ModifiedDto.prototype, key);
            } else if (arrayType === String) {
                IsString({ each: true })(ModifiedDto.prototype, key);
            }
        } else {
            Object.defineProperty(ModifiedDto.prototype, key, {
                value: undefined,
                writable: true,
                enumerable: true,
                configurable: true
            });
            ApiPropertyOptional({ type: propertyType })(ModifiedDto.prototype, key);
            IsOptional()(ModifiedDto.prototype, key);

            if (propertyType === Number) {
                IsNumber()(ModifiedDto.prototype, key);
            } else if (propertyType === String) {
                IsString()(ModifiedDto.prototype, key);
            }
        }
    }

    return IntersectionType(QueryBaseDto, PartialType(ModifiedDto));
}
