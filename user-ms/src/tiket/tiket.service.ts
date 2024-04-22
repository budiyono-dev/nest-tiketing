import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TiketServiceClient } from 'src/proto/proto';
import { Logger } from 'winston';

@Injectable()
export class TiketService implements OnModuleInit {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        @Inject('TIKET_PACKAGE') private client: ClientGrpc,
    ) {}

    private tikerService: TiketServiceClient;

    onModuleInit() {
        this.tikerService =
            this.client.getService<TiketServiceClient>('TiketService');
    }

    getAll() {
        console.log('start');
        return this.tikerService.ping({});
    }
}
