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
    Header,
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
import { extname } from 'path';
import { diskStorage } from 'multer';

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
            data: res,
            code: 'S-001',
            message: 'logout success',
        };
    }

    @Post('/display-picture')
    @UseInterceptors(TokenInterceptor)
    @UseInterceptors(FileInterceptor('file',{
        storage: 
            diskStorage({
                destination: './uploads',
                filename: function (req, file, callback) {
                    const fileExt = extname(file.originalname);
                    const baseName = file.originalname.replace(fileExt, '');
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const newFilename = `${baseName}-${uniqueSuffix}${fileExt}`;
                    callback(null, newFilename);
                  }
            })
        
    }))
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
        const tokenDB = await this.userService.getToken(token);
        const res = this.userService.uploadDp(tokenDB.user_id, file);
        return {
            data: res,
            code: 'S-001',
            message: 'update profile picture success',
        };
    }

    @Get('/display-picture')
    @UseInterceptors(TokenInterceptor)
    @Header('Content-Type', 'image/jpeg')
    async getUserProfilePhoto(
        @Res({ passthrough: true }) res: Response,
        @Headers('Authorization') token: string,
    ): Promise<StreamableFile> {
        console.log('get pd')
        const tokenDB = await this.userService.getToken(token);
        console.log(tokenDB)
        const userId = tokenDB.user_id;
        return await this.userService.getDp(userId);
    }
}
