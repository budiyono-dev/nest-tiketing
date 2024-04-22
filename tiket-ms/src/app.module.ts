import { Module } from '@nestjs/common';
import { TiketController } from './tiket/tiket.controller';

@Module({
  imports: [],
  controllers: [TiketController],
  providers: [],
})
export class AppModule {}
