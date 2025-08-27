// app/tournament/[id]/page.tsx
import * as cheerio from 'cheerio';

interface TournamentDetailsProps {
    params: { id: string };
}

export default async function TournamentDetailsPage({ params }: TournamentDetailsProps) {
    const data = await params;
    const encodedLink = data.id;
    const fullLink = decodeURIComponent(`https://chess-results.com/tnr${encodedLink}.aspx?lan=1&rd=8&art=1`);

    const res = await fetch(fullLink, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        cache: 'no-store',
    });

    if (!res.ok) {
        return <div>Failed to load tournament data.</div>;
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $('h2').first().text().trim();
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
        if (Object.keys(row).length > 0) rows.push(row);
    });

    return (
        <div>
            <h2>Final Ranking Table (JSON)</h2>
            <h2>{title}</h2>
            <pre>{JSON.stringify(rows, null, 2)}</pre>
        </div>
    );
}
