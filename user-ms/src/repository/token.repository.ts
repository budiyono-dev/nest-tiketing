import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { Token, User } from '@prisma/client';

@Injectable()
export class TokenRepository {
    constructor(private prismaService: PrismaService) {}

    async deleteToken(token: string): Promise<void> {
        await this.prismaService.token.delete({
            where: {
                token: token,
            },
        });
    }

    async findToken(token: string): Promise<Token> {
        return await this.prismaService.token.findUnique({
            where: {
                token: token,
            }
        });
    }

    async create(token: Token): Promise<Token> {
        const savedToken = await this.prismaService.token.create({
            data: token,
        });
        return savedToken;
    }
}
