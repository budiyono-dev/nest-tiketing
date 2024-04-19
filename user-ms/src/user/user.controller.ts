import { Body, Controller, Headers, Post, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiResponse } from "src/model/response.model";
import { LoginReq, LoginRes, RegisterUserReq, RegisterUserRes } from "src/model/user.model";
import { TokenInterceptor } from "src/token/token.interceptor";

@Controller('/api/user')
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    async register(@Body() request: RegisterUserReq): Promise<ApiResponse<RegisterUserRes>> {
        const res =  await this.userService.register(request);
        return {
            data: res,
            code: 'S-001',
            message: 'berhasil insert data'
        }
    }

    @Post('/login')
    async login(@Body() request: LoginReq): Promise<ApiResponse<LoginRes>> {
        const res = await this.userService.login(request);
        return {
            data: res,
            code: 'S-001',
            message: 'login success'
        }
    }

    @Post('/logout')
    @UseInterceptors(TokenInterceptor)
    async logout(@Headers('Authorization') token: string) {
        const res = await this.userService.logout(token);
        return {
            data: `ini header ${token}`
        }
    }

}