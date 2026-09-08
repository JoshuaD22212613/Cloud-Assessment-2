"use client";

import { useEffect, useState } from "react";

import WordleGame from "./WordleGame";

import { generateWordleHtml } from "../utils/generateWordleHtml";

export type Difficulty = "easy" | "medium" | "hard";

type WordList = {
  id: number;
  name: string;
  description: string | null;
};

type Phoneme = {
  id: number;
  symbol: string;
  position: number;
  wordId: number;
};

type StoredWord = {
  id: number;
  text: string;
  hint: string | null;
  wordListId: number;
  phonemes: Phoneme[];
};

export default function WordleBuilder() {
  const [activityTitle, setActivityTitle] =
    useState("Phoneme Wordle");

  const [difficulty, setDifficulty] =
    useState<Difficulty>("easy");

  const [showHints, setShowHints] = useState(true);

  // Database data
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [words, setWords] = useState<StoredWord[]>([]);

  const [selectedWordListId, setSelectedWordListId] =
    useState<number | null>(null);

  const [selectedWordId, setSelectedWordId] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Load word lists and words from the backend
  useEffect(() => {
    async function loadDatabaseData() {
      try {
        setLoading(true);
        setError("");

        const [wordListsResponse, wordsResponse] = await Promise.all([
          fetch("/api/wordlists"),
          fetch("/api/words"),
        ]);

        if (!wordListsResponse.ok) {
          throw new Error("Failed to load word lists");
        }

        if (!wordsResponse.ok) {
          throw new Error("Failed to load words");
        }

        const wordListsData: WordList[] =
          await wordListsResponse.json();

        const wordsData: StoredWord[] =
          await wordsResponse.json();

        setWordLists(wordListsData);
        setWords(wordsData);

        // Automatically select the first available word list
        if (wordListsData.length > 0) {
          const firstWordListId = wordListsData[0].id;

          setSelectedWordListId(firstWordListId);

          // Automatically select the first word in that list
          const firstWord = wordsData.find(
            (word) => word.wordListId === firstWordListId
          );

          if (firstWord) {
            setSelectedWordId(firstWord.id);
          }
        }
      } catch (error) {
        console.error("Failed to load Wordle data:", error);

        setError(
          "Unable to load stored words. Please check the backend and database."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDatabaseData();
  }, []);

  // Words belonging to the currently selected list
  const filteredWords = words.filter(
    (word) => word.wordListId === selectedWordListId
  );

  // Currently selected database word
  const selectedWord =
    words.find((word) => word.id === selectedWordId) ?? null;

  function handleWordListChange(wordListId: number) {
    setSelectedWordListId(wordListId);

    const firstWord = words.find(
      (word) => word.wordListId === wordListId
    );

    setSelectedWordId(firstWord ? firstWord.id : null);
  }

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
          Configure the classroom activity and preview the result
          before generating the final HTML file.
        </p>

        {loading && (
          <p className="field-help">
            Loading stored words...
          </p>
        )}

        {error && (
          <p className="field-help">
            {error}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="activity-title">
            Activity title
          </label>

          <input
            id="activity-title"
            type="text"
            value={activityTitle}
            onChange={(event) =>
              setActivityTitle(event.target.value)
            }
            maxLength={60}
          />
        </div>

        <div className="form-group">
          <label htmlFor="word-list">
            Word list
          </label>

          <select
            id="word-list"
            value={selectedWordListId ?? ""}
            onChange={(event) =>
              handleWordListChange(Number(event.target.value))
            }
            disabled={loading || wordLists.length === 0}
          >
            {wordLists.length === 0 && (
              <option value="">
                No word lists available
              </option>
            )}

            {wordLists.map((wordList) => (
              <option
                key={wordList.id}
                value={wordList.id}
              >
                {wordList.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="target-word">
            Target word
          </label>

          <select
            id="target-word"
            value={selectedWordId ?? ""}
            onChange={(event) =>
              setSelectedWordId(Number(event.target.value))
            }
            disabled={loading || filteredWords.length === 0}
          >
            {filteredWords.length === 0 && (
              <option value="">
                No words available
              </option>
            )}

            {filteredWords.map((word) => (
              <option
                key={word.id}
                value={word.id}
              >
                {word.text}
              </option>
            ))}
          </select>

          <p className="field-help">
            Select a word stored in the PostgreSQL database.
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">
            Difficulty
          </label>

          <select
            id="difficulty"
            value={difficulty}
            onChange={(event) =>
              setDifficulty(
                event.target.value as Difficulty
              )
            }
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <p className="field-help">
            Difficulty controls the amount of assistance shown
            to students.
          </p>
        </div>

        <div className="checkbox-group">
          <input
            id="show-hints"
            type="checkbox"
            checked={showHints}
            onChange={(event) =>
              setShowHints(event.target.checked)
            }
          />

          <label htmlFor="show-hints">
            Show phoneme hints
          </label>
        </div>

        <div className="selected-word">
          <span>Selected database word</span>

          {selectedWord ? (
            <>
              <strong>
                {selectedWord.phonemes
                  .map((phoneme) => `/${phoneme.symbol}/`)
                  .join(" ")}
              </strong>

              <small>
                English answer: {selectedWord.text}
              </small>

              {selectedWord.hint && (
                <small>
                  Hint: {selectedWord.hint}
                </small>
              )}
            </>
          ) : (
            <>
              <strong>No word selected</strong>

              <small>
                Add or select a word to create a Wordle.
              </small>
            </>
          )}
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
            <p className="preview-label">
              Live Preview
            </p>

            <h3>
              {activityTitle || "Untitled Activity"}
            </h3>
          </div>

          <span className="difficulty-badge">
            {difficulty}
          </span>
        </div>

        <WordleGame
  difficulty={difficulty}
  showHints={showHints}
  targetWord={
    selectedWord
      ? selectedWord.phonemes.map(
          (phoneme) => phoneme.symbol
        )
      : []
  }
  englishWord={selectedWord?.text ?? ""}
/>
      </section>
    </div>
  );
}