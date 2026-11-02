"use client";

import { useState } from "react";
import type { INewsItem } from "../../models/news";
import NewsCard from "./NewsCard";
import "./NewsList.css";

interface INewsListProps {
  items: INewsItem[];
  facebookConfigured: boolean;
  checkError?: string;
  pageId: string;
}

export default function NewsList({ items: initialItems, facebookConfigured, checkError, pageId }: INewsListProps) {
  const [items, setItems] = useState(initialItems);

  const updateItem = (id: string, changes: Partial<INewsItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  };

  if (!items.length) {
    return <p className="news_empty">Ավարտված մրցաշարեր չկան</p>;
  }

  return (
    <>
      {!facebookConfigured && (
        <p className="news_banner">Facebook-ը կարգավորված չէ, հրապարակման կարգավիճակը հասանելի չէ։</p>
      )}
      {checkError && (
        <p className="news_banner news_banner--error">
          Չհաջողվեց ստուգել Facebook էջի նորությունները՝ {checkError}
        </p>
      )}
      <div className="news_list">
        {items.map((item) => (
          <NewsCard
            key={item.id}
            item={item}
            pageId={pageId}
            onUpdate={(changes) => updateItem(item.id, changes)}
          />
        ))}
      </div>
    </>
  );
}
