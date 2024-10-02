import { IPlayer, IPrizes } from "./player";

export interface ITournament extends IPrizes {
  prizers: IPlayer[];
}
