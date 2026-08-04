"use client";

import { useState } from "react";
import TextForCopy from "../../src/components/textForCopy/TextForCopy";
import correctText from "../../src/helpers/correctText";
import "./NewsCorrector.css";

export default function NewsCorrector() {
  const [input, setInput] = useState("");
  const corrected = correctText(input);

  return (
    <main>
      <h2>Նորության ուղղում</h2>
      <div className="corrector-layout">
        <div className="corrector-section">
          <label htmlFor="news-input">Նորություն</label>
          <textarea
            id="news-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Մուտքագրեք նորությունը..."
            rows={14}
          />
        </div>
        <div className="corrector-section">
          <label>Ուղղված</label>
          {corrected.trim() && <TextForCopy text={corrected} />}
        </div>
      </div>
    </main>
  );
}
