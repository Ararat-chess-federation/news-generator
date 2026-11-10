"use client";

import { useState } from "react";
import TextForCopy from "../../src/components/textForCopy/TextForCopy";
import correctText from "../../src/helpers/correctText";
import "./NewsCorrector.css";

export default function NewsCorrector() {
  const [input, setInput] = useState("");
  const corrected = correctText(input);

  return (
    <main className="container">
      <header className="page_header">
        <h1>Նորության ուղղում</h1>
        <p>Տեղադրեք տեքստը, և կետադրությունն ու բացատները կուղղվեն ավտոմատ</p>
      </header>

      <div className="corrector_layout">
        <section className="card">
          <div className="corrector_header">
            <label htmlFor="news-input" className="card_title">Նորություն</label>
            {input && (
              <button type="button" className="btn btn--ghost btn--small" onClick={() => setInput("")}>
                Մաքրել
              </button>
            )}
          </div>
          <textarea
            id="news-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Մուտքագրեք կամ տեղադրեք նորությունը..."
            rows={14}
          />
        </section>

        <section className="card">
          <h2 className="card_title">Ուղղված</h2>
          {corrected.trim() ? (
            <TextForCopy text={corrected} />
          ) : (
            <p className="corrector_empty">Ուղղված տեքստը կհայտնվի այստեղ</p>
          )}
        </section>
      </div>
    </main>
  );
}
