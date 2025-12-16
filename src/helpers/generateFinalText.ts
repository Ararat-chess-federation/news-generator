import { IFinalTextProps } from "../models/finalText";
import { IPlayer } from "../models/player";
import { parseTournamentTitle } from "./parseTournamentTitle";

export default function generateFinalText({ players, prizes, title }: IFinalTextProps) {
  const { tournament, place } = parseTournamentTitle(title)
  const { first, second, third, girl } = prizes;

  const parts: string[] = [];

  const intro = generateIntro(place, tournament);
  if (intro) parts.push(intro);

  const categoryPlayers = generateCategoryPlayers(players);
  if (categoryPlayers) parts.push(categoryPlayers);

  parts.push("Մրցանակային տեղ գրաված մասնակիցներն են՝");

  const bestGirl = generatePrizer(girl, "Լավագույն աղջիկ` ");
  if (bestGirl) parts.push(bestGirl);

  const thirdPlace = generatePrizer(third, "3-րդ տեղ` ");
  if (thirdPlace) parts.push(thirdPlace);

  const secondPlace = generatePrizer(second, "2-րդ տեղ` ");
  if (secondPlace) parts.push(secondPlace);

  const firstPlace = generatePrizer(first, "Մրցաշարի հաղթող` ");
  if (firstPlace) parts.push(firstPlace);

  if (place && secondPlace) {
    parts.push("Շնորհավորում ենք մրցանակակիրներին և մաղթում նորանոր հաջողություններ:");
  }

  return parts.join("\n");
}

function generateIntro(place: string, tournament: string): string {
  if (!place && !tournament) {
    return "";
  }

  return `${place}ում ավարտվեց ${tournament}ը։`;
}

function generateCategoryPlayers(players: IPlayer[]): string {
  if (!players.length || !players[0]?.player) {
    return "";
  }

  const playerLines = players
    .map((player) => generatePrizer(player))
    .filter((line) => line);

  if (!playerLines.length) {
    return "";
  }

  return `Կարգեր լրացրած մասնակիցներն են՝\n${playerLines.join("\n")}`;
}

function generatePrizer(prizer: IPlayer, prize: string = ""): string {
  if (!prizer?.player) {
    return "";
  }

  const { player, trainer, points } = prizer;
  const playerPoints = points ? `${points} միավորով ` : "";
  const parts: string[] = [playerPoints, prize, player];

  if (trainer) {
    const trainerParts = trainer.split("/");
    if (trainerParts.length > 1) {
      const trainerName = trainerParts[trainerParts.length - 1];
      parts.push(` (մարզիչ՝ ${trainerName})`);
    }
  }

  return `${parts.join("")}:\n`;
}
