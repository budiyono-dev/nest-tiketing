import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ValidationService } from "src/common/validation.service";
import { RegisterUserReq, RegisterUserRes } from "src/model/user.model";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { PrismaService } from "src/common/prisma.service";
import { UserValidation } from "./user.validation";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService
    ) { }
    async register(request: RegisterUserReq): Promise<RegisterUserRes> {
        this.logger.info(`[REGISTER-USER] req ${JSON.stringify(request)} `);
        const RegisterUserReq: RegisterUserReq = this.validationService.validate(
            UserValidation.REGISTER,
            request
        )

        const usernameCount = await this.prismaService.user.count({
            where: { username: request.username },
        })

        if (usernameCount > 0) {
            throw new HttpException('Username Already Exists', 400);
        }

        request.password = await bcrypt.hash(request.password, 10);
        const user = await this.prismaService.user.create({
            data: {
                id: randomUUID().toString(),
                fullname: request.fullname,
                password: request.password,
                username: request.username
            },
        });

        return {
            username: user.username,
            fullname: user.fullname,
        };
    }


}