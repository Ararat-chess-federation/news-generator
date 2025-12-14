import FinalText from '../src/components/finalText/FinalText';
import TextForCopy from '../src/components/textForCopy/TextForCopy';
import { getFinishedTournaments, getHtml, getTournaments } from '../src/helpers/extractData';
import generateFinalText from '../src/helpers/generateFinalText';
import { IPlayer, IPrizes } from '../src/models/player';
import { ITournament } from '../src/models/tournament';

export default async function HtmlFetcher() {
  const html = await getHtml();
  const tournaments = getTournaments(html);
  const finishedTournaments = await getFinishedTournaments(tournaments);
  const combinedIndex = finishedTournaments.findIndex(t => t.title.includes('առանց տարիքային սահմանափակման'));
  let combinedTournamentIds: number[] = [];
  let combinedTournaments: ITournament[] = [];
  if (combinedIndex !== -1) {
    const place = finishedTournaments[combinedIndex].title.split(',')[1].trim();
    const pairIdx = finishedTournaments.findIndex(t => t.title.includes(place) && t !== finishedTournaments[combinedIndex]);
    combinedTournaments = [finishedTournaments[combinedIndex], finishedTournaments[pairIdx]];
    combinedTournamentIds = [pairIdx, combinedIndex].sort((a, b) => a - b);
  };

  finishedTournaments.splice(combinedTournamentIds[0], 1);
  finishedTournaments.splice(combinedTournamentIds[1] - 1, 1);

  const finalText1 = generateFinalText({
    title: "",
    players: [...(combinedTournaments[0].players as IPlayer[])],
    prizes: (combinedTournaments[0].prizes as IPrizes)
  })
  const finalText2 = generateFinalText({
    title: "",
    players: [...(combinedTournaments[1].players as IPlayer[])],
    prizes: (combinedTournaments[1].prizes as IPrizes)
  })
  const finalText = `${combinedTournaments[0].title.split(",")[1].trim()}ում ավարտվեց 4-րդ կարգի որակավորման մրցաշարը, որը անց էր կացվում երկու խմբով՝\n${combinedTournaments[0].title.split(',')[0].trim().split("մրցաշար")[1].trim()} խմբում՝ \n${finalText1}\n\n${combinedTournaments[1].title.split(',')[0].trim().split("մրցաշար")[1].trim()} խմբում՝ \n${finalText2}\nՇնորհավորում ենք մրցանակակիրներին և մաղթում նորանոր հաջողություններ:`;
  return (
    <div>
      <h2>Մրցաշարեր</h2>
      {combinedTournaments.length === 2 && (
        <>
          <a href={combinedTournaments[0].link} target="_blank" rel="noopener noreferrer">
            {combinedTournaments[0].title}
          </a>
          <br />
          <a href={combinedTournaments[1].link} target="_blank" rel="noopener noreferrer">
            {combinedTournaments[1].title}
          </a>
          <TextForCopy text={finalText} />
        </>
      )}
      <ul>
        {finishedTournaments.map((tournament) => (
          <li key={tournament.link}>
            <a href={tournament.link} target="_blank" rel="noopener noreferrer">
              {tournament.title}
            </a>
            <FinalText
              title={tournament.title}
              players={tournament.players as IPlayer[]}
              prizes={tournament.prizes as IPrizes}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
