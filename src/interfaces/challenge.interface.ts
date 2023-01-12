import { ChallengeStatus } from 'src/enum/challenge-status.enum';

export interface ChallengesInterface {
  DateTimeChallenge: Date;
  status: ChallengeStatus;
  DateTimeRequest: Date;
  DateTimeResponse?: Date;
  requester: string;
  category: string;
  match?: string;
  players: string[];
}
