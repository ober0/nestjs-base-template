import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { UserResponseDto, UserWithPasswordResponseDto } from "./dto/response.dto";
import { UserCreateDto } from "./dto/create.dto";
import * as bcrypt from "bcrypt";
import { RoleNames } from "../role/enum/base-roles";
import { RoleService } from "../role/role.service";
import { UserSearchDto } from "./dto/search.dto";

@Injectable()
export class UserService {
    private readonly saltRounds = process.env.SALT_ROUNDS;

    constructor(
        private readonly repository: UserRepository,
        private readonly roleService: RoleService
    ) {
        if (!this.saltRounds) {
            throw Error("Не указана SALT_ROUNDS в енвах");
        }
    }

    async hashPassword(password: string): Promise<string> {
        await this.validate(password);
        return bcrypt.hash(password, Number(this.saltRounds));
    }

    async validate(password: string): Promise<boolean> {
        if (password.length < 8) {
            throw new BadRequestException("Пароль должен содержать минимум 8 символов");
        }
        if (!/[a-z]/.test(password)) {
            throw new BadRequestException("Пароль должен содержать хотя бы одну строчную букву");
        }
        if (!/[A-Z]/.test(password)) {
            throw new BadRequestException("Пароль должен содержать хотя бы одну заглавную букву");
        }
        if (!/\d/.test(password)) {
            throw new BadRequestException("Пароль должен содержать хотя бы одну цифру");
        }
        return true;
    }

    async findOneById(id: number): Promise<UserResponseDto> {
        const data = await this.repository.findOneById(id);
        if (!data) {
            throw new NotFoundException("Пользователь не найден");
        }
        return data;
    }

    async findOneByUsername(username: string): Promise<UserResponseDto | null> {
        return this.repository.findOneByUsername(username);
    }

    async create(dto: UserCreateDto): Promise<UserResponseDto> {
        const user = await this.findOneByUsername(dto.username);
        if (user) {
            throw new ConflictException("Пользователь с таким username уже существует, попробуйте другое имя профиля.");
        }

        const hashedPassword = await this.hashPassword(dto.password);

        const data = {
            ...dto,
            password: hashedPassword
        };
        return this.repository.create(data);
    }

    async findOneByUsernameWithPassword(username: string): Promise<UserWithPasswordResponseDto | null> {
        return this.repository.findOneByUsernameWithPassword(username);
    }

    async register(dto: UserCreateDto): Promise<UserResponseDto> {
        const isExists = await this.findOneByUsername(dto.username);
        if (isExists) {
            throw new BadRequestException("Пользователь с таким именем уже существует.");
        }

        let roleId: number;
        if (!dto.roleId) {
            const role = await this.roleService.findRoleByName(RoleNames.User);
            if (!role) {
                throw new InternalServerErrorException("Базовая роль не создана, обратитесь к администратору");
            }
            roleId = role.id;
        } else {
            roleId = dto.roleId;
        }

        return this.create({
            ...dto,
            roleId
        });
    }

    async search(dto: UserSearchDto) {
        const [data, count] = await Promise.all([this.repository.search(dto), this.repository.count(dto)]);

        return {
            data,
            count
        };
    }
}
