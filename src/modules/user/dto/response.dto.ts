import { UserBaseDto } from "./base.dto";
import { OmitType } from "@nestjs/swagger";

export class UserWithPasswordResponseDto extends UserBaseDto {}
export class UserResponseDto extends OmitType(UserWithPasswordResponseDto, ["password"]) {}
