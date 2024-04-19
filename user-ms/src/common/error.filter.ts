import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common"
import { ZodError } from "zod";

@Catch(HttpException, ZodError)
export class ErrorFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const res = host.switchToHttp().getResponse();

        if (exception instanceof ZodError) {
            res.status(400).json({
                errors: "BAD REQUEST",
            });
        } else if (exception instanceof HttpException) {
            res.status(exception.getStatus()).json({
                errors: exception.getResponse(),
            });
        } else {
            res.status(exception.getStatus()).json({
                errors: exception.message,
            });
        }
    }
}