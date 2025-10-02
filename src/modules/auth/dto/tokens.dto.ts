import { ApiProperty, PickType } from "@nestjs/swagger";

export class TokenBaseDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}

export class RefreshResponseDto extends PickType(TokenBaseDto, ["accessToken"]) {}

export class SaveToken {
    userId: number;
    refreshToken: string;
}

export class TokenPayload {
    @ApiProperty()
    id: number;
}
