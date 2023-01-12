import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxymqModule } from './proxymq/proxymq.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), ProxymqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
