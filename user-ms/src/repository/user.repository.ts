import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
    constructor(private prismaService: PrismaService) {}

    async isUsernameExist(username: string): Promise<boolean> {
        const usernameCount = await this.prismaService.user.count({
            where: { username: username },
        });

        if (usernameCount > 0) {
            return true;
        }
        return false;
    }

    async isEmailExist(email: string): Promise<boolean> {
        const usernameCount = await this.prismaService.user.count({
            where: { email: email },
        });

        if (usernameCount > 0) {
            return true;
        }
        return false;
    }

    async findByUsername(username: string): Promise<User> {
        const user = await this.prismaService.user.findUnique({
            where: {
                username: username,
            },
        });
        return user;
    }

    async create(user: User): Promise<User> {
        const savedUser = await this.prismaService.user.create({
            data: user,
        });
        return savedUser;
    }

    async findByUserId(userId: string): Promise<User> {
        const savedUser = await this.prismaService.user.findFirst({
            where: {
                id: userId,
            },
        });
        return savedUser;
    }

    async updateProfilePicture(userId: string, profilePicture: string): Promise<User> {
        const savedUser = await this.prismaService.user.update({
            where: {
                id: userId,
            },
            data: {
                profile_picture: profilePicture
            }
        });
        return savedUser;
    }
}
