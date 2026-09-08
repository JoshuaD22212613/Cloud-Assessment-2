"use client";

import { useEffect, useState } from "react";

import WordSearchGame from "./WordSearchGame";

import { generateWordSearchHtml } from "../utils/generateWordSearchHtml";

export type WordSearchDifficulty =
  | "easy"
  | "medium"
  | "hard";

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

export default function WordSearchBuilder() {
  const [activityTitle, setActivityTitle] =
    useState("Phoneme Word Search");

  const [difficulty, setDifficulty] =
    useState<WordSearchDifficulty>("easy");

  const [showHints, setShowHints] = useState(true);

  // Database data
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const [words, setWords] = useState<StoredWord[]>([]);

  const [selectedWordListId, setSelectedWordListId] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDatabaseData() {
      try {
        setLoading(true);
        setError("");

        const [wordListsResponse, wordsResponse] =
          await Promise.all([
            fetch("/api/wordlists"),
            fetch("/api/words"),
          ]);

        if (!wordListsResponse.ok) {
          throw new Error(
            "Failed to load word lists."
          );
        }

        if (!wordsResponse.ok) {
          throw new Error(
            "Failed to load words."
          );
        }

        const wordListsData: WordList[] =
          await wordListsResponse.json();

        const wordsData: StoredWord[] =
          await wordsResponse.json();

        setWordLists(wordListsData);
        setWords(wordsData);

        if (wordListsData.length > 0) {
          setSelectedWordListId(
            wordListsData[0].id
          );
        }
      } catch (error) {
        console.error(
          "Failed to load Word Search data:",
          error
        );

        setError(
          "Unable to load stored words. Please check the backend and database."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDatabaseData();
  }, []);

  const selectedWords = words.filter(
    (word) =>
      word.wordListId === selectedWordListId
  );

  function handleWordListChange(
    wordListId: number
  ) {
    setSelectedWordListId(wordListId);
    setError("");
  }

  function downloadHtml() {
    if (!selectedWordListId) {
      setError(
        "Please select a stored word list before generating the activity."
      );
      return;
    }

    if (selectedWords.length === 0) {
      setError(
        "The selected word list does not contain any words."
      );
      return;
    }

    /*
      We will connect the database words to the
      standalone generator in the next step.
    */
    const html = generateWordSearchHtml({
      title:
        activityTitle ||
        "Phoneme Word Search",
      difficulty,
      showHints,
    });

    const blob = new Blob([html], {
      type: "text/html;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "phoneme-word-search.html";

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
          Configure the Word Search activity
          and preview the result before
          generating the final HTML file.
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
          <label htmlFor="word-search-title">
            Activity title
          </label>

          <input
            id="word-search-title"
            type="text"
            value={activityTitle}
            onChange={(event) =>
              setActivityTitle(
                event.target.value
              )
            }
            maxLength={60}
          />
        </div>

        <div className="form-group">
          <label htmlFor="word-search-list">
            Word list
          </label>

          <select
            id="word-search-list"
            value={selectedWordListId ?? ""}
            onChange={(event) =>
              handleWordListChange(
                Number(event.target.value)
              )
            }
            disabled={
              loading ||
              wordLists.length === 0
            }
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

          <p className="field-help">
            Words are loaded from the
            PostgreSQL database.
          </p>
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
                event.target
                  .value as WordSearchDifficulty
              )
            }
          >
            <option value="easy">
              Easy
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="hard">
              Hard
            </option>
          </select>

          <p className="field-help">
            Difficulty controls the amount
            of assistance provided to
            students.
          </p>
        </div>

        <div className="checkbox-group">
          <input
            id="word-search-hints"
            type="checkbox"
            checked={showHints}
            onChange={(event) =>
              setShowHints(
                event.target.checked
              )
            }
          />

          <label htmlFor="word-search-hints">
            Show word hints
          </label>
        </div>

        <div className="selected-word">
          <span>
            Selected database word list
          </span>

          {selectedWordListId ? (
            <>
              <strong>
                {selectedWords.length}{" "}
                {selectedWords.length === 1
                  ? "word"
                  : "words"}
              </strong>

              {selectedWords.length > 0 ? (
                <>
                  <small>
                    {selectedWords
                      .map(
                        (word) =>
                          word.text
                      )
                      .join(", ")}
                  </small>

                  <small>
                    {selectedWords
                      .map(
                        (word) =>
                          `${word.text}: /${word.phonemes
                            .slice()
                            .sort(
                              (a, b) =>
                                a.position -
                                b.position
                            )
                            .map(
                              (phoneme) =>
                                phoneme.symbol
                            )
                            .join(" ")}/`
                      )
                      .join(" • ")}
                  </small>
                </>
              ) : (
                <small>
                  No words are stored in
                  this list yet.
                </small>
              )}
            </>
          ) : (
            <>
              <strong>
                No word list selected
              </strong>

              <small>
                Create or select a stored
                word list first.
              </small>
            </>
          )}
        </div>

        <button
          type="button"
          className="generate-button"
          onClick={downloadHtml}
          disabled={
            loading ||
            !selectedWordListId ||
            selectedWords.length === 0
          }
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
              {activityTitle ||
                "Untitled Activity"}
            </h3>
          </div>

          <span className="difficulty-badge">
            {difficulty}
          </span>
        </div>

        {/*
          The existing game remains here for
          this checkpoint. Next we will replace
          its hard-coded words/grid with
          selectedWords.
        */}
        <WordSearchGame
  difficulty={difficulty}
  showHints={showHints}
  words={selectedWords}
/>
      </section>
    </div>
  );
}