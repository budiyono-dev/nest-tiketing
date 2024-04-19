import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Inject, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Logger } from "winston";
import { PrismaService } from "src/common/prisma.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";


@Injectable()
export class TokenInterceptor implements NestInterceptor {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        this.logger.info('[TOKEN-INTERCEPTOR]');

        const req = context.switchToHttp().getRequest();
        const auth = req.headers['authorization'];
        
        if (!auth) {
            throw new HttpException('Unauthorized', 401);
        }
        const token = this.prismaService.token.findUnique({
            where: {
                token: auth
            }
        });
        if (!token) {
            throw new HttpException('Unauthorized', 401);
        }
        return next.handle();
    }
}
