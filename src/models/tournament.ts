import { IPlayer, IPrizes } from "./player";


export interface ITournamentRow {
  'Rk.': string;
  SNo: string;
  col2: string;
  Name: string;
  FED: string;
  Rtg: string;
  'Club/City': string;
  'Pts.': string;
  TB1: string;
  TB2: string;
  TB3: string;
}
export interface ITournament {
  title: string;
  link: string;
  rows: ITournamentRow[],
  players?: IPlayer[],
  prizes?: IPrizes
}