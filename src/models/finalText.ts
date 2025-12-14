import { IPlayer, IPrizes } from "./player";

export interface IFinalTextProps {
    selectedPlace: string;
    selectedTournament: string;
    players: IPlayer[];
    prizes: IPrizes;
}