import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoinGeckoService } from './coin-gecko.service';
import { HttpModule } from '@nestjs/axios';
import { CoinGeckoController } from './coin-gecko.controller';

@Module({
    imports: [HttpModule],
    controllers: [AppController, CoinGeckoController],
    providers: [AppService, CoinGeckoService],
})
export class AppModule { }
