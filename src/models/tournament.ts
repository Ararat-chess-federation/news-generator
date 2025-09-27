import { IPlayer, IPrizes } from "./player";

export interface ITournament {
  title: string;
  link: string;
  rows: string[],
  players?: IPlayer[],
  prizes?: IPrizes
}