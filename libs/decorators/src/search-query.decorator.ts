import { BadRequestException, createParamDecorator, ExecutionContext, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { SortTypes } from "@app/common-dto/sort-types.dto";
import { DateMinMaxFilterDto, NumberMinMaxFilterDto } from "@app/common-dto/min-max.filter.dto";
import { QueryBaseDto } from "@app/common-dto/base-query.dto";

function getAllSort(query: any): Record<string, SortTypes> | undefined {
    const { sort } = query;

    const raw = Array.isArray(sort) ? sort : typeof sort === "string" ? sort.split(",") : [];

    const prepared = raw.map((entry) => entry?.trim()).filter((entry) => typeof entry === "string" && entry.length);

    if (!prepared.length) {
        return undefined;
    }

    const errors: {
        property: string;
        constraints: Record<string, string>;
    }[] = [];

    const result: Record<string, SortTypes> = {};
    const usedFields = new Set<string>();

    prepared.forEach((entry) => {
        const [fieldRaw, directionRaw, ...rest] = entry.split(":");
        const field = fieldRaw?.trim();
        const direction = directionRaw?.trim().toLowerCase();

        if (!field || !direction || rest.length) {
            errors.push({
                property: "sort",
                constraints: {
                    conflict: "Неверный формат"
                }
            });
            return;
        }

        if (!["asc", "desc"].includes(direction)) {
            errors.push({
                property: "sort",
                constraints: {
                    conflict: "Неверный формат направления сортировки"
                }
            });
            return;
        }

        if (usedFields.has(field)) {
            errors.push({
                property: "sort",
                constraints: {
                    conflict: "Нельзя указать сортировку по одному полю несколько раз"
                }
            });
            return;
        }

        usedFields.add(field);

        result[field] = direction === "desc" ? SortTypes.DESC : SortTypes.ASC;
    });

    if (errors.length > 0) {
        throw new BadRequestException(errors);
    }

    return result;
}

function getAllFilter(
    query
): Record<string, string | number | DateMinMaxFilterDto | NumberMinMaxFilterDto | string[] | number[]> | undefined {
    const { q, page, take, sort, ...filter } = query;

    const correctFilters: Record<string, unknown> = {};

    Object.entries(filter).forEach(([key, value]) => {
        const filterValue = value;
        if (key.endsWith("[min]")) {
            const baseKey = key.slice(0, -"[min]".length);
            const range = (correctFilters[baseKey] as Record<string, unknown>) ?? {};
            range.min = filterValue;
            correctFilters[baseKey] = range;
        } else if (key.endsWith("[max]")) {
            const baseKey = key.slice(0, -"[max]".length);
            const range = (correctFilters[baseKey] as Record<string, unknown>) ?? {};
            range.max = filterValue;
            correctFilters[baseKey] = range;
        } else {
            correctFilters[key] = filterValue;
        }
    });
    return Object.keys(correctFilters).length > 0
        ? (correctFilters as Record<
              string,
              string | number | DateMinMaxFilterDto | NumberMinMaxFilterDto | string[] | number[]
          >)
        : undefined;
}

function generateDtoInstance<T extends object>(type: new () => T, query: Record<string, unknown>) {
    const dto = plainToInstance(type, query, {
        enableImplicitConversion: true
    });

    const queryErrors = validateSync(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: false,
        always: true
    });

    if (queryErrors.length > 0) {
        const correctErrors: {
            property: string;
            constraints: Record<string, string>;
        }[] = [];

        const getErrors = (el) => {
            el.map((el) => {
                if ("property" in el && "constraints" in el) {
                    correctErrors.push({
                        property: el.property,
                        constraints: el.constraints
                    });
                }
                if ("children" in el && Array.isArray(el.children) && el.children.length) {
                    getErrors(el.children);
                }
            });
        };

        try {
            getErrors(queryErrors);
        } catch (ex) {
            Logger.error(`Ошибка при парсе ошибок из query ${ex}`);
        }

        throw new BadRequestException(
            correctErrors.length
                ? correctErrors
                : {
                      property: null,
                      constraints: {
                          error: "Ошибка в параметрах запроса"
                      }
                  }
        );
    }

    return dto;
}

export const SearchQuery = <T extends object, I extends QueryBaseDto>(type: new () => T, validateType: new () => I) =>
    createParamDecorator((data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const queryDto = generateDtoInstance(validateType, request.query);

        const filters = getAllFilter(queryDto);

        const obj = {
            pagination: {
                count: queryDto.take,
                page: queryDto.page
            },
            query: queryDto.q,
            sorts: getAllSort(queryDto),
            filters: {
                ...filters
            }
        };

        return generateDtoInstance(type, obj);
    })();
