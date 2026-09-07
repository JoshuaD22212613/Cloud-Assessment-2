"use client";

import { useState } from "react";
import WordSearchGame from "./WordSearchGame";
import { generateWordSearchHtml } from "../utils/generateWordSearchHtml";

export type WordSearchDifficulty = "easy" | "medium" | "hard";

export default function WordSearchBuilder() {
  const [activityTitle, setActivityTitle] =
    useState("Phoneme Word Search");

  const [difficulty, setDifficulty] =
    useState<WordSearchDifficulty>("easy");

  const [showHints, setShowHints] = useState(true);
  function downloadHtml() {
  const html = generateWordSearchHtml({
    title: activityTitle || "Phoneme Word Search",
    difficulty,
    showHints,
  });

  const blob = new Blob([html], {
    type: "text/html;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "phoneme-word-search.html";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

  return (
    <div className="builder-layout">
      <section className="builder-controls">
        <h3>Activity Settings</h3>

        <p className="builder-description">
          Configure the Word Search activity and preview the result before
          generating the final HTML file.
        </p>

        <div className="form-group">
          <label htmlFor="word-search-title">
            Activity title
          </label>

          <input
            id="word-search-title"
            type="text"
            value={activityTitle}
            onChange={(event) =>
              setActivityTitle(event.target.value)
            }
            maxLength={60}
          />
        </div>

        <div className="form-group">
          <label htmlFor="word-search-difficulty">
            Difficulty
          </label>

          <select
            id="word-search-difficulty"
            value={difficulty}
            onChange={(event) =>
              setDifficulty(
                event.target.value as WordSearchDifficulty
              )
            }
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <p className="field-help">
            Difficulty will control the amount of assistance
            provided to students.
          </p>
        </div>

        <div className="checkbox-group">
          <input
            id="word-search-hints"
            type="checkbox"
            checked={showHints}
            onChange={(event) =>
              setShowHints(event.target.checked)
            }
          />

          <label htmlFor="word-search-hints">
            Show word hints
          </label>
        </div>

        <div className="selected-word">
          <span>Assessment 1 word list</span>
          <strong>5 phoneme words</strong>
          <small>
            Fixed for Assessment 1. Dynamic word lists can be
            introduced in later assessments.
          </small>
        </div>

        <button
  type="button"
  className="generate-button"
  onClick={downloadHtml}
>
  Generate HTML
</button>
      </section>

      <section className="builder-preview">
        <div className="preview-heading">
          <div>
            <p className="preview-label">Live Preview</p>

            <h3>
              {activityTitle || "Untitled Activity"}
            </h3>
          </div>

          <span className="difficulty-badge">
            {difficulty}
          </span>
        </div>

        <WordSearchGame
          difficulty={difficulty}
          showHints={showHints}
        />
      </section>
    </div>
  );
}