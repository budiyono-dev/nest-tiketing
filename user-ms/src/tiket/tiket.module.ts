import { Module } from "@nestjs/common";
import { TiketController } from "./tiket.controller";
import { TiketService } from "./tiket.service";
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
    providers: [TiketService],
    controllers: [TiketController],
    imports: [
        ClientsModule.register([
            {
              name: 'TIKET_PACKAGE',
              transport: Transport.GRPC,
              options: {
                package: 'app',
                protoPath: join(__dirname, '../proto/tiket.proto'),
              }
            }
          ])
    ]
})
export class TiketModule {}