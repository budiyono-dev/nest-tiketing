import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from 'src/repository/user.repository';
import { TokenRepository } from 'src/repository/token.repository';

@Module({
    providers: [UserService, UserRepository, TokenRepository],
    controllers: [UserController],
})
export class UserModule {}
