import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { SortTypes } from "@app/common-dto/sort-types.dto";
import { DateMinMaxFilterDto, NumberMinMaxFilterDto } from "@app/common-dto/min-max.filter.dto";

function getAllSort(query: Record<string, unknown>): Record<string, SortTypes> {
    return {};
}

function getAllFilter(
    query: Record<string, unknown>
): Record<string, string | number | DateMinMaxFilterDto | NumberMinMaxFilterDto | string[] | number[]> {
    return {};
}

export const SearchQuery = <T extends object>(type: new () => T) =>
    createParamDecorator((data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const query = request.query;

        const obj = {
            pagination: {
                take: query.take,
                page: query.page
            },
            query: query.q,
            sorts: getAllSort(query),
            filters: getAllFilter(query)
        };

        const dto = plainToInstance(type, obj, { enableImplicitConversion: true });
        console.log(dto);
        const errors = validateSync(dto, {
            whitelist: true,
            forbidNonWhitelisted: true,
            skipMissingProperties: false,
            always: true
        });

        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }

        return dto;
    })();
