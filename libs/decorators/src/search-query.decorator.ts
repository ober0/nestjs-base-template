import { BadRequestException, createParamDecorator, ExecutionContext, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { SortTypes } from "@app/common-dto/sort-types.dto";
import { DateMinMaxFilterDto, NumberMinMaxFilterDto } from "@app/common-dto/min-max.filter.dto";
import { log } from "console";

function getAllSort(query: Record<string, unknown>): Record<string, SortTypes> | undefined {
    return undefined;
}

function getAllFilter(
    query: Record<string, unknown>
): Record<string, string | number | DateMinMaxFilterDto | NumberMinMaxFilterDto | string[] | number[]> | undefined {
    console.log(query);
    return undefined;
}

function generateDtoInstance(type: new () => object, query: Record<string, unknown>) {
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

        throw new BadRequestException(correctErrors.length ? correctErrors : {
            property: null,
            constraints: {
                error: "Ошибка в параметрах запроса"
            }
        });
    }

    return query;
}

export const SearchQuery = <T extends object, I extends object>(type: new () => T, validateType: new () => I) =>
    createParamDecorator((data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const queryDto = generateDtoInstance(validateType, request.query);

        const obj = {
            pagination: {
                count: queryDto.take,
                page: queryDto.page
            },
            query: queryDto.q,
            sorts: getAllSort(queryDto),
            filters: getAllFilter(queryDto)
        };

        const dto = generateDtoInstance(type, obj);

        return dto;
    })();
