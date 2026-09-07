"use client";

import { useState } from "react";
import WordleGame from "./WordleGame";
import { generateWordleHtml } from "../utils/generateWordleHtml";

export type Difficulty = "easy" | "medium" | "hard";

export default function WordleBuilder() {
  const [activityTitle, setActivityTitle] = useState("Phoneme Wordle");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [showHints, setShowHints] = useState(true);

  function downloadHtml() {
  const html = generateWordleHtml({
    title: activityTitle || "Phoneme Wordle",
    difficulty,
    showHints,
  });

  const blob = new Blob([html], {
    type: "text/html;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "phoneme-wordle.html";

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
          Configure the classroom activity and preview the result before
          generating the final HTML file.
        </p>

        <div className="form-group">
          <label htmlFor="activity-title">Activity title</label>

          <input
            id="activity-title"
            type="text"
            value={activityTitle}
            onChange={(event) => setActivityTitle(event.target.value)}
            maxLength={60}
          />
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">Difficulty</label>

          <select
            id="difficulty"
            value={difficulty}
            onChange={(event) =>
              setDifficulty(event.target.value as Difficulty)
            }
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <p className="field-help">
            Difficulty controls the amount of assistance shown to students.
          </p>
        </div>

        <div className="checkbox-group">
          <input
            id="show-hints"
            type="checkbox"
            checked={showHints}
            onChange={(event) => setShowHints(event.target.checked)}
          />

          <label htmlFor="show-hints">
            Show phoneme hints
          </label>
        </div>

        <div className="selected-word">
          <span>Assessment 1 word</span>
          <strong>/ʃ/ /ɪ/ /p/</strong>
          <small>English answer is revealed when solved.</small>
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
            <h3>{activityTitle || "Untitled Activity"}</h3>
          </div>

          <span className="difficulty-badge">
            {difficulty}
          </span>
        </div>

        <WordleGame
  difficulty={difficulty}
  showHints={showHints}
/>
      </section>
    </div>
  );
}