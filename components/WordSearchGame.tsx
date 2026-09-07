"use client";

import { useState } from "react";

type WordSearchGameProps = {
  difficulty: "easy" | "medium" | "hard";
  showHints: boolean;
};

const words = [
  { english: "SHIP", phonemes: ["ʃ", "ɪ", "p"] },
  { english: "THIN", phonemes: ["θ", "ɪ", "n"] },
  { english: "CAT", phonemes: ["k", "æ", "t"] },
  { english: "DOG", phonemes: ["d", "ɔ", "ɡ"] },
  { english: "SUN", phonemes: ["s", "ɐ", "n"] },
];

const grid = [
  ["ʃ", "ɪ", "p", "m", "θ", "s", "æ", "n"],
  ["k", "æ", "t", "ɪ", "ɹ", "d", "ɔ", "p"],
  ["d", "ɔ", "ɡ", "n", "s", "ɐ", "n", "k"],
  ["θ", "ɪ", "n", "p", "æ", "m", "ʃ", "t"],
  ["s", "ɐ", "n", "ɡ", "ɪ", "k", "ɔ", "d"],
  ["m", "p", "æ", "t", "ɹ", "ɪ", "n", "s"],
  ["ɪ", "θ", "k", "ɔ", "d", "ʃ", "p", "æ"],
  ["n", "s", "ɐ", "m", "t", "ɡ", "ɪ", "ɹ"],
];

export default function WordSearchGame({
  difficulty,
  showHints,
}: WordSearchGameProps) {
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [message, setMessage] = useState(
    "Select phonemes in the grid to find a word."
  );

  function selectCell(row: number, column: number) {
    const id = `${row}-${column}`;

    if (selectedCells.includes(id)) {
      setSelectedCells(
        selectedCells.filter((selectedId) => selectedId !== id)
      );
    } else {
      setSelectedCells([...selectedCells, id]);
    }
  }

  function checkSelection() {
    const selectedSymbols = selectedCells.map((id) => {
      const [row, column] = id.split("-").map(Number);
      return grid[row][column];
    });

    const selectedWord = selectedSymbols.join("");

    const match = words.find(
      (word) => word.phonemes.join("") === selectedWord
    );

    if (match) {
      if (!foundWords.includes(match.english)) {
        setFoundWords([...foundWords, match.english]);
        setMessage(
          `Found! /${match.phonemes.join(" ")}/ = ${match.english}`
        );
      } else {
        setMessage(`${match.english} has already been found.`);
      }
    } else {
      setMessage("That selection does not match a word. Try again.");
    }

    setSelectedCells([]);
  }

  function clearSelection() {
    setSelectedCells([]);
    setMessage("Selection cleared.");
  }

  function resetGame() {
    setSelectedCells([]);
    setFoundWords([]);
    setMessage("Select phonemes in the grid to find a word.");
  }

  return (
    <div className="word-search-game">
      <section className="word-search-panel">
        <h3>Activity Preview</h3>

        <p>
          Find all five phoneme words hidden in the grid.
          Difficulty: <strong>{difficulty}</strong>.
        </p>

        <div
          className="word-search-grid"
          aria-label="Phoneme word search grid"
        >
          {grid.map((row, rowIndex) =>
            row.map((symbol, columnIndex) => {
              const id = `${rowIndex}-${columnIndex}`;
              const selected = selectedCells.includes(id);

              return (
                <button
                  type="button"
                  key={id}
                  className={`word-search-cell ${
                    selected ? "selected-cell" : ""
                  }`}
                  onClick={() => selectCell(rowIndex, columnIndex)}
                  aria-pressed={selected}
                  aria-label={`Phoneme ${symbol}, row ${
                    rowIndex + 1
                  }, column ${columnIndex + 1}`}
                >
                  {symbol}
                </button>
              );
            })
          )}
        </div>

        <p className="game-message" aria-live="polite">
          {message}
        </p>

        <div className="wordle-actions">
          <button
            type="button"
            className="primary-action-button"
            onClick={checkSelection}
          >
            Check Word
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={clearSelection}
          >
            Clear Selection
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={resetGame}
          >
            Reset
          </button>
        </div>
      </section>

      <aside className="word-list-panel">
        <h3>Words to Find</h3>

        <p>
  {difficulty === "easy"
    ? "Use the English words and phoneme forms as hints."
    : difficulty === "medium"
      ? "Use the phoneme forms as hints."
      : "Find each hidden phoneme word without a word list hint."}
</p>

        <ul className="word-search-list">
          {words.map((word) => {
            const found = foundWords.includes(word.english);

            return (
              <li
                key={word.english}
                className={found ? "found-word" : ""}
              >
                <strong>
  {found
    ? `/${word.phonemes.join(" ")}/`
    : !showHints
      ? "Hidden word"
      : difficulty === "easy" || difficulty === "medium"
        ? `/${word.phonemes.join(" ")}/`
        : "Hidden word"}
</strong>

<span>
  {found
    ? `${word.english} ✓`
    : !showHints
      ? "Not found"
      : difficulty === "easy"
        ? word.english
        : difficulty === "medium"
          ? "English answer hidden"
          : "Not found"}
</span>
              </li>
            );
          })}
        </ul>

        <p className="word-count">
          Found {foundWords.length} of {words.length}
        </p>
      </aside>
    </div>
  );
}