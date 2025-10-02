import { ApiProperty, OmitType, PartialType, PickType } from "@nestjs/swagger";
import { IsDate, IsNumber, IsString } from "class-validator";
import { RoleBaseDto } from "./base.dto";
import { RoleCreateDto } from "./create.dto";
export class RoleUpdateDto extends PartialType(RoleCreateDto) {}
