"use client"

import { useState } from "react";
import "./TextForCopy.css"

export default function TextForCopy({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="final_container">
      <div>
        <button className="copy_button" onClick={handleCopy}>
          📄
        </button>
        {copied && (
          <span>
            Copied!
          </span>
        )}
      </div>
      {text}
    </div>
  );
}
