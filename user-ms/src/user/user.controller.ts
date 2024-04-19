import {
    Body,
    Controller,
    Headers,
    Post,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    FileTypeValidator,
    MaxFileSizeValidator,
    Get,
    Res,
    StreamableFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResponse } from 'src/model/response.model';
import {
    LoginReq,
    LoginRes,
    RegisterUserReq,
    RegisterUserRes,
} from 'src/model/user.model';
import { TokenInterceptor } from 'src/token/token.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { createReadStream } from 'fs';

@Controller('/api/user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    async register(
        @Body() request: RegisterUserReq,
    ): Promise<ApiResponse<RegisterUserRes>> {
        const res = await this.userService.register(request);
        return {
            data: res,
            code: 'S-001',
            message: 'berhasil insert data',
        };
    }

    @Post('/login')
    async login(@Body() request: LoginReq): Promise<ApiResponse<LoginRes>> {
        const res = await this.userService.login(request);
        return {
            data: res,
            code: 'S-001',
            message: 'login success',
        };
    }

    @Post('/logout')
    @UseInterceptors(TokenInterceptor)
    async logout(@Headers('Authorization') token: string) {
        const res = await this.userService.logout(token);
        return {
            data: `ini header ${token}`,
        };
    }

    @Post('/display-picture')
    @UseInterceptors(TokenInterceptor)
    @UseInterceptors(FileInterceptor('file'))
    async uploadProfilePicture(
        @Headers('Authorization') token: string,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        file.destination = './uploads'
        file.filename = 'uploads123.jpeg'
        
        const tokenDB = await this.userService.getToken(token);
        const res = this.userService.uploadDp(tokenDB.user_id, file);
    }

    @Get('/display-picture')
    getUserProfilePhoto(
        @Res({ passthrough: true }) res: Response
    ): StreamableFile {

        res.headers.set('Content-Type', 'image/jpeg');

        const imageLocation = join(process.cwd(), 'uploads', '15c924f42ffaa67b3f14a5be05f0a312');
        const file = createReadStream(imageLocation);
        return new StreamableFile(file);
    }
}
