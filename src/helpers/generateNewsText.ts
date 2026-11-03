import type { IPlayer, IPrizes } from "../models/player";
import type { ITournament } from "../models/tournament";
import generateFinalText from "./generateFinalText";
import { parseTournamentTitle } from "./parseTournamentTitle";

export function generateTournamentText(tournament: ITournament) {
  return generateFinalText({
    title: tournament.title,
    players: tournament.players as IPlayer[],
    prizes: tournament.prizes as IPrizes,
  });
}

function extractGroupName(tournamentTitle: string): string {
  return tournamentTitle.split("մրցաշար")[1]?.trim() || tournamentTitle;
}

export function generateCombinedText([tournament1, tournament2]: [ITournament, ITournament]) {
  const { place, tournament: tournamentPart1 } = parseTournamentTitle(tournament1.title);
  const { tournament: tournamentPart2 } = parseTournamentTitle(tournament2.title);

  const groupName1 = extractGroupName(tournamentPart1);
  const groupName2 = extractGroupName(tournamentPart2);

  const finalText1 = generateFinalText({
    title: "",
    players: tournament1.players as IPlayer[],
    prizes: tournament1.prizes as IPrizes,
  });

  const finalText2 = generateFinalText({
    title: "",
    players: tournament2.players as IPlayer[],
    prizes: tournament2.prizes as IPrizes,
  });

  const intro = `${place}ում ավարտվեց 4-րդ կարգի որակավորման մրցաշարը, որը անց էր կացվում երկու խմբով՝`;
  const tournament1Text = `${groupName1} խմբում՝ \n${finalText1}`;
  const tournament2Text = `${groupName2} խմբում՝ \n${finalText2}`;
  const epilog = "Շնորհավորում ենք մրցանակակիրներին և մաղթում նորանոր հաջողություններ:";

  return `${intro}\n\n${tournament1Text}\n\n${tournament2Text}\n\n${epilog}`;
}
