import { IPlayer } from "../models/player.js";

export const defaultPlayer: IPlayer = { player: "", trainer: "" };

export const prizers = {
  third: "3-րդ տեղ՝",
  second: "2-րդ տեղ՝",
  winner: "Մրցաշարի հաղթող դարձավ",
  girl: "Լավագույն աղջիկ ճանաչվեց",
};

export const defaultPrizes = {
  first: { ...defaultPlayer },
  second: { ...defaultPlayer },
  third: { ...defaultPlayer },
  girl: { ...defaultPlayer },
};
