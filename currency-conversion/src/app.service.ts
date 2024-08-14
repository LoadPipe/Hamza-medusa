import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios/index';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }
}
