import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { TiketModule } from './tiket/tiket.module';

@Module({
  imports: [UserModule, CommonModule, TiketModule],
})
export class AppModule {}
