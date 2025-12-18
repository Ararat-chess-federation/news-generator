import { IPlayer, IPrizes } from "./player";

export interface IFinalTextProps {
    title: string;
    players: IPlayer[];
    prizes: IPrizes;
}
