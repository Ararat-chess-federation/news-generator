import { IPlayer } from "../../models/player";
import modifyName from "./modifyName";

export enum EValuesKeys {
  place = "Из турнирной базы данных Chess-Results http://chess-results.com",
  name = "_2",
  trainer = "_5",
  points = "_6",
}

export function getTournamentInfo(data: { [key: string]: string }[]) {
  const placeAndTournament: any = data[0];
  const finalTable = data.slice(4);
  let [tournament, place] = placeAndTournament[EValuesKeys.place].split(",");

  place += "քաղաքում"
  if (tournament.endsWith("մրցաշար")) {
    tournament = tournament.slice(0, tournament.lastIndexOf("մրցաշար")).trim();
  }

  return { tournament, place, finalTable };
}

function getPlayer(data: { [key: string]: string }): IPlayer {
  return {
    player: modifyName(data[EValuesKeys.name]),
    trainer: data[EValuesKeys.trainer].split("/").pop() as string,
    prize: data[EValuesKeys.place],
    points: data[EValuesKeys.points],
  };
}

export function getPrizersByJSON(jsonData: { [key: string]: string }[]) {
  const prizers = [];

  const first = getPlayer(jsonData[0]);
  const second = getPlayer(jsonData[1]);
  const third = getPlayer(jsonData[2]);
  const girl = { player: "", trainer: "" };

  for (let i = 3; i < jsonData.length; i++) {
    const player = jsonData[i];

    if (Number(player[EValuesKeys.points]) < 6) {
      break;
    }

    const prizer = getPlayer(player);

    prizers.push(prizer);
  }

  return {
    first,
    second,
    third,
    girl,
    prizers,
  };
}
