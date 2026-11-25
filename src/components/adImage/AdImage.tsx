"use client";

import { useState } from "react";
import "./AdImage.css";

export default function AdImage({ src }: { src?: string }) {
  const [isAvailable, setIsAvailable] = useState(true);

  if (!src || !isAvailable) {
    return null;
  }

  return (
    <section className="card ad_image">
      <h2 className="card_title">Նկար</h2>
      <img className="ad_image_preview" src={src} alt="Հայտարարության նկար" onError={() => setIsAvailable(false)} />
      <a className="btn btn--ghost ad_image_download" href={src} download={src.split("/").pop()}>
        ⬇ Ներբեռնել
      </a>
    </section>
  );
}
