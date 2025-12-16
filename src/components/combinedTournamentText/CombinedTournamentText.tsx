import { IPlayer, IPrizes } from "../../models/player";
import { ITournament } from "../../models/tournament";
import { getFinalText } from "../finalText/FinalText";
import TextForCopy from "../textForCopy/TextForCopy";

interface ICombinedTournamentTextProps {
  tournaments: [ITournament, ITournament];
}

function parseTournamentTitle(title: string): { tournament: string; place: string } {
  const [tournament, place] = title.split(',').map(part => part.trim());
  return { tournament, place };
}

function extractGroupName(tournamentTitle: string): string {
  return tournamentTitle.split("մրցաշար")[1]?.trim() || tournamentTitle;
}

export default function CombinedTournamentText({ tournaments }: ICombinedTournamentTextProps) {
  const [tournament1, tournament2] = tournaments;
  const { place } = parseTournamentTitle(tournament1.title);
  const { tournament: tournamentPart1 } = parseTournamentTitle(tournament1.title);
  const { tournament: tournamentPart2 } = parseTournamentTitle(tournament2.title);
  
  const groupName1 = extractGroupName(tournamentPart1);
  const groupName2 = extractGroupName(tournamentPart2);
  
  const finalText1 = getFinalText({
    title: "",
    players: tournament1.players as IPlayer[],
    prizes: tournament1.prizes as IPrizes
  });
  
  const finalText2 = getFinalText({
    title: "",
    players: tournament2.players as IPlayer[],
    prizes: tournament2.prizes as IPrizes
  });
  
  const combinedText = `${place}ում ավարտվեց 4-րդ կարգի որակավորման մրցաշարը, որը անց էր կացվում երկու խմբով՝\n${groupName1} խմբում՝ \n${finalText1}\n\n${groupName2} խմբում՝ \n${finalText2}\nՇնորհավորում ենք մրցանակակիրներին և մաղթում նորանոր հաջողություններ:`;
  
  return <TextForCopy text={combinedText} />;
}

