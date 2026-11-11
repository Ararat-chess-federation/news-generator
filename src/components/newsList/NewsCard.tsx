"use client";

import { saveFacebookDraft } from "../../../app/actions";
import type { INewsItem } from "../../models/news";
import FacebookSave from "../facebookSave/FacebookSave";
import StatusBadge from "../facebookSave/StatusBadge";
import TextForCopy from "../textForCopy/TextForCopy";

interface INewsCardProps {
  item: INewsItem;
  onUpdate: (changes: Partial<INewsItem>) => void;
}

export default function NewsCard({ item, onUpdate }: INewsCardProps) {
  const isPosted = item.status === "draft" || item.status === "published";

  return (
    <article className={`card news_card news_card--${item.status}`}>
      <header className="news_card_header">
        <div className="news_card_titles">
          {item.tournaments.map(({ title, link }) => (
            <a key={link} href={link} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          ))}
        </div>
        <StatusBadge status={item.status} />
      </header>

      <FacebookSave
        status={item.status}
        postUrl={item.postUrl}
        postedAt={item.postedAt}
        onSave={() => saveFacebookDraft(item.tournaments.map(({ link }) => link))}
        onSaved={(result) => onUpdate({
          status: result.status === "created" ? "draft" : "published",
          postId: result.postId,
          postUrl: result.postUrl,
          postedAt: result.postedAt,
        })}
      />

      {isPosted ? (
        <details>
          <summary>Ցույց տալ տեքստը</summary>
          <TextForCopy text={item.text} />
        </details>
      ) : (
        <TextForCopy text={item.text} />
      )}
    </article>
  );
}
