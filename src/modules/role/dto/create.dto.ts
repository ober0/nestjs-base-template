import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";
import { IsDate, IsNumber, IsString } from "class-validator";
import { RoleBaseDto } from "./base.dto";
export class RoleCreateDto extends OmitType(RoleBaseDto, ["id", "createdAt"]) {
    @ApiProperty({ type: Number, required: true })
    @IsNumber({}, { each: true })
    permissionIds: number[];
}
