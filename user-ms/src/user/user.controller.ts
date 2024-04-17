import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiResponse } from "src/model/response.model";
import { RegisterUserReq, RegisterUserRes } from "src/model/user.model";

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

}