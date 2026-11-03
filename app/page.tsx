import NewsList from '../src/components/newsList/NewsList';
import { getFinishedTournaments, getHtml, getTournaments } from '../src/helpers/extractData';
import { findExistingPost, getNewsKey, getRecentPosts, isFacebookConfigured } from '../src/helpers/facebook';
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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("hy-AM", { day: "numeric", month: "long", year: "numeric" });
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
    const existing = canCheck
      ? await findExistingPost(getNewsKey(newsTournaments), posts).catch(() => undefined)
      : undefined;
    const status: NewsStatus = !canCheck
      ? "unknown"
      : existing ? (existing.is_published === false ? "draft" : "published") : "new";

    return {
      id: newsTournaments[0].link,
      tournaments: newsTournaments.map(({ title, link }) => ({ title, link })),
      text,
      status,
      postId: existing?.id,
      postedAt: existing?.created_time ? formatDate(existing.created_time) : undefined,
    };
  };

  const items = await Promise.all([
    ...(combinedTournaments.length === 2
      ? [toNewsItem(combinedTournaments, generateCombinedText(combinedTournaments as [ITournament, ITournament]))]
      : []),
    ...regularTournaments.map((tournament) => toNewsItem([tournament], generateTournamentText(tournament))),
  ]);
  items.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

  return (
    <div className="container">
      <h2>Մրցաշարեր</h2>
      <NewsList
        items={items}
        facebookConfigured={configured}
        checkError={checkError}
        pageId={process.env.FB_PAGE_ID ?? ""}
      />
    </div>
  );
}
