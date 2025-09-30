import FinalText from '../src/components/finalText/FinalText';
import { getFinishedTournaments, getHtml, getTournaments } from '../src/helpers/extractData';
import { IPlayer, IPrizes } from '../src/models/player';


export default async function HtmlFetcher() {
  const html = await getHtml();
  const tournaments = getTournaments(html);
  const finishedTournaments = await getFinishedTournaments(tournaments);

  return (
    <div>
      <h2>Մրցաշարեր</h2>
      <ul>
        {finishedTournaments.map((tournament) => (
          <li key={tournament.link}>
            <a href={tournament.link} target="_blank" rel="noopener noreferrer">
              {tournament.title}
            </a>
            <FinalText
              selectedTournament={tournament.title.split(",")[0]}
              selectedPlace={tournament.title.split(",")[1]}
              players={tournament.players as IPlayer[]}
              prizes={tournament.prizes as IPrizes}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
