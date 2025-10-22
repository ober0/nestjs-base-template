import { Body, Controller, HttpCode, HttpStatus, Post, Res, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginControllerResponseDto, LoginDto } from "./dto/login.dto";
import express from "express";
import { RefreshResponseDto } from "./dto/tokens.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: "Вход пользователя" })
    @HttpCode(HttpStatus.OK)
    @Post("login")
    @ApiOkResponse({ type: LoginControllerResponseDto })
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response: express.Response
    ): Promise<LoginControllerResponseDto> {
        const data = await this.authService.login(loginDto);

        response.cookie("refreshToken", data.refreshToken, {
            secure: true,
            sameSite: "none",
            httpOnly: true,
            maxAge: 1000 * 3600 * 24 * 7 // 7 дней
        });

        response.cookie("accessToken", data.accessToken, {
            secure: true,
            sameSite: "none",
            httpOnly: true,
            maxAge: 1000 * 3600 // 1 час
        });
        return {
            accessToken: data.accessToken,
            user: data.user
        };
    }

    @ApiOperation({ summary: "Обновление токенов" })
    @ApiOkResponse({ type: RefreshResponseDto })
    @HttpCode(HttpStatus.OK)
    @Post("refresh")
    async refresh(
        @Req() request: express.Request,
        @Res({ passthrough: true }) response: express.Response
    ): Promise<RefreshResponseDto> {
        const refreshToken = request.cookies["refreshToken"];
        if (!refreshToken) {
            throw new ForbiddenException("Refresh токен не найден");
        }

        const data = await this.authService.refresh(refreshToken);

        response.cookie("refreshToken", data.refreshToken, {
            secure: true,
            sameSite: "none",
            httpOnly: true,
            maxAge: 1000 * 3600 * 24 * 7 // 7 дней
        });

        response.cookie("accessToken", data.accessToken, {
            secure: true,
            sameSite: "none",
            httpOnly: true,
            maxAge: 1000 * 3600 // 1 час
        });

        return {
            accessToken: data.accessToken
        };
    }

    @ApiOperation({ summary: "Выход пользователя" })
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse()
    @Post("logout")
    async logout(@Req() request: express.Request,): Promise<void> {
        const refreshToken = request.cookies["refreshToken"];
        if (!refreshToken) {
            throw new ForbiddenException("Refresh токен не найден");
        }

        await this.authService.logout(refreshToken);
    }
}
