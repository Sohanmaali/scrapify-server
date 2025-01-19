import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return "<h1 align='center'>Hello i am Scrapify service <br> Created by Sohan 😎😎</h1";
  }
}
