import * as cheerio from 'cheerio';
import { ITournament, ITournamentRow } from '../models/tournament';
import { defaultPlayer } from '../constants/players';

const url = 'https://chess-results.com/fed.aspx?fed=ARM';
const KEYWORDS = ['Արարատ', 'Արտաշատ', 'Վեդի', 'Մասիս'];

export async function getHtml() {
    const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
    }

    return res.text();
}

export async function getFinishedTournaments(tournaments: ITournament[]) {
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
            return []
        }
        const html = await res.text();
        tournament.rows = getRows(html);
        if (!tournament.rows.length) {
            continue
        }

        const players = tournament.rows
            .filter((el) => toNumber(el["Pts."] ?? el.TB1) > 5.5)
            .map((el) => {
                return {
                    player: el.Name,
                    trainer: el['Club/City'],
                    prize: el["Rk."],
                    points: el["Pts."] ?? el.TB1,
                };
            });

        tournament.players = players.slice(3)
        tournament.prizes = {
            first: players[0],
            second: players[1],
            third: players[2],
            // TODO: find the best girl
            girl: defaultPlayer
        };

        finishedTournaments.push(tournament)
    }

    return finishedTournaments
}

function toNumber(str: string) {
    return parseFloat(str.replace(",", "."));
}

function extractId(url: string) {
    const match = url.match(/tnr(\d+)\.aspx/);
    return match ? match[1] : null;
}

export function getTournaments(html: string) {
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

    const rows: ITournamentRow[] = [];
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