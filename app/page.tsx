import * as cheerio from 'cheerio';

const url = 'https://chess-results.com/fed.aspx?fed=ARM';
const KEYWORDS = ['Արարատ', 'Արտաշատ', 'Վեդի', 'Մասիս'];

export default async function HtmlFetcher() {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const tournaments: { title: string; link: string }[] = [];

  $('a').each((_, el) => {
    const title = $(el).text().trim();
    const href = $(el).attr('href');
    const regionalTournament = KEYWORDS.some((kw) => title.toLowerCase().includes(kw.toLowerCase()));

    if (title && href && regionalTournament) {
      tournaments.push({
        title,
        link: href,
      });
    }
  });

  return (
    <div>
      <h2>Filtered Tournaments</h2>
      <ul>
        {tournaments.map((tournament) => (
          <li key={tournament.link}>
            <a href={tournament.link} target="_blank" rel="noopener noreferrer">
              {tournament.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
