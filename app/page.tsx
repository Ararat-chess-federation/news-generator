import CombinedTournamentText from '../src/components/combinedTournamentText/CombinedTournamentText';
import FinalText from '../src/components/finalText/FinalText';
import { getFinishedTournaments, getHtml, getTournaments } from '../src/helpers/extractData';
import getSortedTournaments from '../src/helpers/getSortedTournaments';
import { IPlayer, IPrizes } from '../src/models/player';
import { ITournament } from '../src/models/tournament';

export default async function HtmlFetcher() {
  const html = await getHtml();
  const tournaments = getTournaments(html);
  const finishedTournaments = await getFinishedTournaments(tournaments);
  const { combinedTournaments, regularTournaments } = getSortedTournaments(finishedTournaments)

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
