import { Injectable, Logger } from '@nestjs/common';
import { ChallengesInterface } from './interfaces/challenge.interface';
import { ClientProxySmartRanking } from './proxymq/client-proxy.proxymq';
import { RpcException } from '@nestjs/microservices';
import { createTransport } from 'nodemailer';
import { PlayersInterface } from './interfaces/player.interface';
import { firstValueFrom } from 'rxjs';
import HTML_NOTIFICATION_ADVERSARY from './static/html-notification-adversary.static';

@Injectable()
export class AppService {
  constructor(private clientSmartRanking: ClientProxySmartRanking) {}

  private clientadminBackEnd =
    this.clientSmartRanking.getClientProxyAdminBackendInstance();

  private readonly logger = new Logger(AppService.name);

  async sendMailForAdversary(challenge: ChallengesInterface): Promise<void> {
    try {
      // Indentificar o adversário
      let idPlayerAdversary = '';

      challenge.players.map((player) => {
        if (player != challenge.requester) idPlayerAdversary = player;
      });

      this.logger.log(idPlayerAdversary);

      // Recuperar informções adicionais do jogador

      const playerAdversary: PlayersInterface = await firstValueFrom(
        this.clientadminBackEnd.send('consultar-jogador', idPlayerAdversary),
      );

      const requester: PlayersInterface = await firstValueFrom(
        this.clientadminBackEnd.send('consultar-jogador', challenge.requester),
      );

      let markup = '';
      markup = HTML_NOTIFICATION_ADVERSARY;
      markup = markup.replace(/#NOME_ADVERSARIO/g, playerAdversary.name);
      markup = markup.replace(/#NOME_SOLICITANTE/g, requester.name);

      const transport = await createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_DESTINY_NODEMAILER,
          pass: process.env.PASS_FOR_MAIL,
        },
      });

      await transport
        .sendMail({
          from: `Matheus ${process.env.EMAIL_DESTINY_NODEMAILER}`,
          to: playerAdversary.email,
          subject: 'Notificação de desafio',
          html: markup,
        })
        .then(() => this.logger.log('Email enviado'))
        .catch((error) => this.logger.error(JSON.stringify(error)));
    } catch (error) {
      Logger.error(`Erro: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
