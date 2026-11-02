"use client";

import { useState, useTransition } from "react";
import { saveFacebookDraft } from "../../../app/actions";
import type { INewsItem, NewsStatus } from "../../models/news";
import TextForCopy from "../textForCopy/TextForCopy";

interface INewsCardProps {
  item: INewsItem;
  pageId: string;
  onUpdate: (changes: Partial<INewsItem>) => void;
}

const STATUS_LABELS: Record<NewsStatus, string> = {
  new: "🆕 Նոր",
  draft: "📝 Սևագիր",
  published: "✅ Հրապարակված",
  unknown: "Կարգավիճակն անհայտ է",
};

function getPostUrl(item: INewsItem, pageId: string) {
  if (item.status === "published" && item.postId) {
    return { url: `https://www.facebook.com/${item.postId}`, label: "Բացել Facebook-ում" };
  }
  if (item.status === "draft") {
    return { url: `https://business.facebook.com/latest/posts?asset_id=${pageId}`, label: "Բացել Business Suite-ում" };
  }
  return undefined;
}

export default function NewsCard({ item, pageId, onUpdate }: INewsCardProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const isPosted = item.status === "draft" || item.status === "published";
  const postUrl = getPostUrl(item, pageId);

  const handleSave = () => {
    setError("");
    startTransition(async () => {
      const result = await saveFacebookDraft(item.tournaments.map(({ link }) => link));
      if (result.status === "error") {
        setError(result.message);
        return;
      }
      onUpdate({
        status: result.status === "created" ? "draft" : "published",
        postId: result.postId,
        postedAt: result.status === "created" ? new Date().toLocaleDateString("hy-AM") : undefined,
      });
    });
  };

  return (
    <article className={`news_card news_card--${item.status}`}>
      <header className="news_card_header">
        <div className="news_card_titles">
          {item.tournaments.map(({ title, link }) => (
            <a key={link} href={link} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          ))}
        </div>
        <span className={`status_badge status_badge--${item.status}`}>{STATUS_LABELS[item.status]}</span>
      </header>

      {isPosted && (
        <p className="news_card_meta">
          {item.postedAt && <span>{item.postedAt}</span>}
          {postUrl && (
            <a href={postUrl.url} target="_blank" rel="noopener noreferrer">
              {postUrl.label} ↗
            </a>
          )}
        </p>
      )}

      {item.status === "new" && (
        <div className="news_card_actions">
          <button onClick={handleSave} disabled={isPending}>
            {isPending ? "Պահպանվում է..." : "Պահպանել որպես Facebook սևագիր"}
          </button>
          {error && <span className="news_card_error">{error}</span>}
        </div>
      )}

      {isPosted ? (
        <details>
          <summary>Տեքստը</summary>
          <TextForCopy text={item.text} />
        </details>
      ) : (
        <TextForCopy text={item.text} />
      )}
    </article>
  );
}
