import * as cheerio from 'cheerio';
import FinalText from '../src/components/finalText/FinalText';
import { ITournament } from '../src/models/tournament';

const url = 'https://chess-results.com/fed.aspx?fed=ARM';
const KEYWORDS = ['Արարատ', 'Արտաշատ', 'Վեդի', 'Մասիս'];

export default async function HtmlFetcher() {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }
  const html = await res.text();
  const tournaments = getTournaments(html);
  const finishedTournaments: ITournament[] = [];
  
  for (const tournament of tournaments) {
    const id = extractId(tournament.link);
    const round = tournament.title.includes("4-րդ") ? 8 : 9;
    let fullLink = decodeURIComponent(`https://chess-results.com/tnr${id}.aspx?lan=1&rd=${round}&art=1`);
    let res = await fetch(fullLink, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store',
    });

    if (!res.ok) {
      return <div>Failed to load tournament data.</div>;
    }
    const html = await res.text();
    tournament.rows = getRows(html);
    if (!tournament.rows.length) {
      continue
    }

    tournament.players = tournament.rows.slice(0, 4).map((el: any) => {
      return {
        player: el.Name,
        trainer: el['Club/City'],
        prize: el["Rk."],
        points: el.TB1,
      };
    });

    tournament.prizes = {
      first: tournament.players[0],
      second: tournament.players[1],
      third: tournament.players[2],
      girl: tournament.players[2]
    };

    finishedTournaments.push(tournament)
  }

  return (
    <div>
      <h2>Filtered Tournaments</h2>
      <ul>
        {finishedTournaments.map((tournament) => (
          <li key={tournament.link}>
            <a href={tournament.link} target="_blank" rel="noopener noreferrer">
              {tournament.title}
            </a>
            <FinalText
              selectedTournament={tournament.title}
              selectedPlace={tournament.title}
              players={tournament.players as any}
              prizes={tournament.prizes as any}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function extractId(url: string) {
  const match = url.match(/tnr(\d+)\.aspx/);
  return match ? match[1] : null;
}

function getTournaments(html: string) {
  const $ = cheerio.load(html);
  const tournaments: ITournament[] = [];

  $('a').each((_, el) => {
    const title = $(el).text().trim();
    const href = $(el).attr('href');
    const regionalTournament = KEYWORDS.some((kw) => title.toLowerCase().includes(kw.toLowerCase()));

    if (title && href && regionalTournament) {
      tournaments.push({
        title,
        link: href,
        rows: [],
      });
    }
  });

  return tournaments;
}

function getRows(html: string) {
  const $ = cheerio.load(html);

  const finalTable = $('.CRs1');
  const headers: string[] = [];
  finalTable.find('tr').first().find('th').each((_, th) => {
    headers.push($(th).text().replace(/\s+/g, ' ').trim());
  });

  const rows: any[] = [];
  finalTable.find('tr').slice(1).each((_, tr) => {
    const row: any = {};
    $(tr).find('td').each((i, td) => {
      row[headers[i] || `col${i}`] = $(td).text().replace(/\s+/g, ' ').trim();
    });
    if (Object.keys(row).length > 0) {
      rows.push(row);
    }
  });

  return rows;
}