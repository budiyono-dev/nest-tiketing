import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable } from "rxjs";
import { Hello } from 'src/proto/proto';

@Controller()
export class TiketController {

  @GrpcMethod('TiketService', 'Ping')
  ping(): Promise<Hello> | Observable<Hello> | Hello {
    console.log('kshdbfjbhsdf');
    return {msg: 'from service'};
  }
}
