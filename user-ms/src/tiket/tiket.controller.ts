import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { TiketService } from "./tiket.service";
import { TokenInterceptor } from "src/token/token.interceptor";

@Controller('/api/tiket')
export class TiketController {
    constructor(private tiketService: TiketService) {}

    @Get()
    @UseInterceptors(TokenInterceptor)
    async getAllTiket(){
        const tikets = this.tiketService.getAll();
        return {
            data: tikets,
            code: 'S-001',
            message: 'logout success',
        };
    }
}