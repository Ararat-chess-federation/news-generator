import CombinedTournamentText from '../src/components/combinedTournamentText/CombinedTournamentText';
import FinalText from '../src/components/finalText/FinalText';
import { getFinishedTournaments, getHtml, getTournaments } from '../src/helpers/extractData';
import { parseTournamentTitle } from '../src/helpers/parseTournamentTitle';
import { IPlayer, IPrizes } from '../src/models/player';
import { ITournament } from '../src/models/tournament';

export default async function HtmlFetcher() {
  const html = await getHtml();
  const tournaments = getTournaments(html);
  const finishedTournaments = await getFinishedTournaments(tournaments);
  
  const combinedIndex = finishedTournaments.findIndex(t => t.title.includes('առանց տարիքային սահմանափակման'));
  let combinedTournaments: ITournament[] = [];
  let regularTournaments: ITournament[] = [];

  if (combinedIndex !== -1) {
    const combinedTournament = finishedTournaments[combinedIndex];
    const { place } = parseTournamentTitle(combinedTournament.title);
    const pairIdx = finishedTournaments.findIndex(
      (t, idx) => idx !== combinedIndex && t.title.includes(place)
    );
    
    combinedTournaments = [combinedTournament, finishedTournaments[pairIdx]];
    regularTournaments = finishedTournaments.filter(
      (_, idx) => idx !== combinedIndex && idx !== pairIdx
    );
  } else {
    regularTournaments = finishedTournaments;
  }

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
          <CombinedTournamentText tournaments={combinedTournaments as [ITournament, ITournament]} />
        </>
      )}
      <ul>
        {regularTournaments.map((tournament) => (
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
