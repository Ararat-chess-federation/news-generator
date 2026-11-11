"use client"

import { useState } from "react";
import "./TextForCopy.css"

export default function TextForCopy({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="copy_box">
      <div className="copy_box_toolbar">
        <span className="copy_box_label">Տեքստ</span>
        <button
          type="button"
          className={`btn btn--ghost btn--small copy_box_button${copied ? " copy_box_button--copied" : ""}`}
          onClick={handleCopy}
        >
          {copied ? "✓ Պատճենվեց" : "📋 Պատճենել"}
        </button>
      </div>
      <div className="copy_box_text">{text}</div>
    </div>
  );
}
