export interface IPlayer {
  player: string;
  trainer: string;
  prize?: string | number;
  points?: string | number;
}

export interface IPrizes {
  girl: IPlayer;
  third: IPlayer;
  second: IPlayer;
  first: IPlayer;
}
