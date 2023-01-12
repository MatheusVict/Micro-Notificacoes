import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { ChallengesInterface } from './interfaces/challenge.interface';

const ackErros: string[] = ['E11000'];
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('notificacao-novo-desafio')
  async sendMailAdversary(
    @Payload() challenge: ChallengesInterface,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originMessage = context.getMessage();

    try {
      Logger.log(`Desafio: ${JSON.stringify(challenge)}`);
      await this.appService.sendMailForAdversary(challenge);
      await channel.ack(originMessage);
    } catch (error) {
      Logger.error(`Erro: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErros.filter((ackErro) =>
        error.message.includes(ackErro),
      );

      if (filterAckError.length == 0) await channel.ack(originMessage);
    }
  }
}
