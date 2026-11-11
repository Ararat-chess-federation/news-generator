import NewsList from '../src/components/newsList/NewsList';
import { getFinishedTournaments, getHtml, getTournaments } from '../src/helpers/extractData';
import { findExistingPost, getNewsKey, getRecentPosts, isFacebookConfigured, toFacebookStatus } from '../src/helpers/facebook';
import { generateCombinedText, generateTournamentText } from '../src/helpers/generateNewsText';
import getSortedTournaments from '../src/helpers/getSortedTournaments';
import type { IFacebookPost } from '../src/models/facebook';
import type { INewsItem, NewsStatus } from '../src/models/news';
import type { ITournament } from '../src/models/tournament';

const STATUS_ORDER: Record<NewsStatus, number> = { new: 0, unknown: 1, draft: 2, published: 3 };

async function loadFacebookPosts(): Promise<{ posts: IFacebookPost[]; checkError?: string }> {
  if (!isFacebookConfigured()) {
    return { posts: [] };
  }

  try {
    return { posts: await getRecentPosts() };
  } catch (error) {
    console.error("Failed to load Facebook posts", error);
    return { posts: [], checkError: error instanceof Error ? error.message : String(error) };
  }
}

export default async function HtmlFetcher() {
  const html = await getHtml();
  const tournaments = getTournaments(html);
  const finishedTournaments = await getFinishedTournaments(tournaments);
  const { combinedTournaments, regularTournaments } = getSortedTournaments(finishedTournaments)
  const configured = isFacebookConfigured();
  const { posts, checkError } = await loadFacebookPosts();
  const canCheck = configured && !checkError;

  const toNewsItem = async (newsTournaments: ITournament[], text: string): Promise<INewsItem> => {
    const base = {
      id: newsTournaments[0].link,
      tournaments: newsTournaments.map(({ title, link }) => ({ title, link })),
      text,
    };

    if (!canCheck) {
      return { ...base, status: "unknown" };
    }

    const existing = await findExistingPost(getNewsKey(newsTournaments), posts).catch(() => undefined);
    const { status, postId, postUrl, postedAt } = toFacebookStatus(existing);
    return { ...base, status, postId, postUrl, postedAt };
  };

  const items = await Promise.all([
    ...(combinedTournaments.length === 2
      ? [toNewsItem(combinedTournaments, generateCombinedText(combinedTournaments as [ITournament, ITournament]))]
      : []),
    ...regularTournaments.map((tournament) => toNewsItem([tournament], generateTournamentText(tournament))),
  ]);
  items.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

  return (
    <main className="container">
      <header className="page_header">
        <h1>Մրցաշարերի արդյունքներ</h1>
        <p>Ավարտված որակավորման մրցաշարերի նորությունները chess-results.com-ից</p>
      </header>
      <NewsList
        items={items}
        facebookConfigured={configured}
        checkError={checkError}
      />
    </main>
  );
}
