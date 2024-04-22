import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { join } from 'path';

const logger = new Logger('Main');
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,  {
    transport: Transport.GRPC,
    options: {
      package: 'app',  
      protoPath: join(__dirname, 'proto/tiket.proto'),
    }
  });
  
  app.listen();
}
bootstrap();
