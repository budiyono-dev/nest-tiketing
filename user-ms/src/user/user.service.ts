import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ValidationService } from "src/common/validation.service";
import { LoginReq, LoginRes, RegisterUserReq, RegisterUserRes } from "src/model/user.model";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { UserValidation } from "./user.validation";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { UserRepository } from "src/repository/user.repository";
import { TokenRepository } from "src/repository/token.repository";

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private userRepository: UserRepository,
        private tokenRepository: TokenRepository
    ) { }
    async register(request: RegisterUserReq): Promise<RegisterUserRes> {
        this.logger.info(`[REGISTER-USER] req ${JSON.stringify(request)} `);
        const RegisterUserReq: RegisterUserReq = this.validationService.validate(
            UserValidation.REGISTER,
            request
        )

        const isUsernameExist = await this.userRepository.isUsernameExist(request.username);
        if (isUsernameExist) {
            throw new HttpException('Username Already Exists', 400);
        }

        const isEmailExist =  await this.userRepository.isEmailExist(request.email);

        if (isEmailExist) {
            throw new HttpException('Email Already Exists', 400);
        }

        request.password = await bcrypt.hash(request.password, 10);
        const user = await this.userRepository.create({
            id: randomUUID().toString(),
            fullname: request.fullname,
            password: request.password,
            username: request.username,
            email: request.email
        })

        return {
            username: user.username,
            fullname: user.fullname,
        };
    }

    async login(request: LoginReq): Promise<LoginRes> {
        this.logger.info(`[LOGIN USER] ${request.username}`);
        const loginUserReq = this.validationService.validate(UserValidation.LOGIN, request);

        const user = await this.userRepository.findByUsername(request.username);
        this.logger.info(JSON.stringify(user));
        if (!user) {
            throw new HttpException(`Invalid username or password`, 401);
        }

        const passwordValid = await bcrypt.compare(loginUserReq.password, user.password);
        this.logger.info(passwordValid);
        if (!passwordValid) {
            throw new HttpException(`Invalid username or password`, 401);
        }
        const token = Buffer.from(`${loginUserReq.username}:${randomUUID().toString()}`)
            .toString('base64');

        await this.tokenRepository.create({
            token: token,
            expired: Math.floor(new Date().getTime() / 1000)
        })

        return {
            token: token
        };
    }

    async logout(token: string): Promise<void> {
        this.logger.info(`[LOGOUT USER] ${token}`);
        await this.tokenRepository.deleteToken(token);
    }

}