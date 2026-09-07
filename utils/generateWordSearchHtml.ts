type WordSearchHtmlSettings = {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  showHints: boolean;
};

export function generateWordSearchHtml({
  title,
  difficulty,
  showHints,
}: WordSearchHtmlSettings): string {
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

  const safeTitle = title
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>${safeTitle}</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 30px 20px;
      background: #f4f7fb;
      color: #1d2939;
      font-family: Arial, Helvetica, sans-serif;
    }

    .game {
      max-width: 900px;
      margin: 0 auto;
    }

    header {
      text-align: center;
      margin-bottom: 30px;
    }

    header h1 {
      margin-bottom: 8px;
    }

    .difficulty {
      color: #667085;
      text-transform: capitalize;
    }

    .game-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 220px;
      gap: 25px;
      align-items: start;
    }

    .puzzle,
    .word-panel {
      background: white;
      border: 1px solid #dce3ea;
      border-radius: 12px;
      padding: 24px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(8, 48px);
      gap: 5px;

      width: fit-content;
      margin: 10px auto 25px;
    }

    .cell {
      width: 48px;
      height: 48px;

      border: 2px solid #dce3ea;
      border-radius: 7px;

      background: #f4f7fb;
      color: #1d2939;

      font-size: 1.05rem;
      font-weight: bold;

      cursor: pointer;
    }

    .cell:hover {
      border-color: #315f8c;
    }

    .cell:focus-visible,
    .control:focus-visible {
      outline: 3px solid #8eb9df;
      outline-offset: 2px;
    }

    .cell.selected {
      background: #315f8c;
      border-color: #315f8c;
      color: white;
    }

    .message {
      min-height: 24px;
      font-weight: bold;
      text-align: center;
    }

    .controls {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin-top: 20px;
    }

    .control {
      border: none;
      border-radius: 8px;

      padding: 11px 16px;

      background: #315f8c;
      color: white;

      font-weight: bold;
      cursor: pointer;
    }

    .word-list {
      list-style: none;
      padding: 0;
      margin: 20px 0;
    }

    .word-list li {
      display: flex;
      flex-direction: column;
      gap: 4px;

      padding: 10px 0;

      border-bottom: 1px solid #dce3ea;
    }

    .word-list li:last-child {
      border-bottom: none;
    }

    .word-list span {
      color: #667085;
      font-size: 0.85rem;
    }

    .word-list .found strong,
    .word-list .found span {
      text-decoration: line-through;
      opacity: 0.65;
    }

    .word-count {
      font-weight: bold;
    }

    @media (max-width: 700px) {
      .game-layout {
        grid-template-columns: 1fr;
      }

      .word-panel {
        order: -1;
      }
    }

    @media (max-width: 500px) {
      .grid {
        grid-template-columns: repeat(8, minmax(30px, 1fr));
        width: 100%;
        gap: 3px;
      }

      .cell {
        width: 100%;
        height: 40px;
        font-size: 0.9rem;
      }

      .puzzle,
      .word-panel {
        padding: 16px;
      }
    }
  </style>
</head>

<body>

  <main class="game">

    <header>
      <h1>${safeTitle}</h1>

      <p>
        Find all five phoneme words hidden in the puzzle.
      </p>

      <p class="difficulty">
        Difficulty: ${difficulty}
      </p>
    </header>

    <div class="game-layout">

      <section class="puzzle">

        <div
          id="grid"
          class="grid"
          aria-label="Phoneme word search grid"
        ></div>

        <p
          id="message"
          class="message"
          aria-live="polite"
        >
          Select phonemes in the grid to find a word.
        </p>

        <div class="controls">

          <button
            type="button"
            class="control"
            onclick="checkSelection()"
          >
            Check Word
          </button>

          <button
            type="button"
            class="control"
            onclick="clearSelection()"
          >
            Clear Selection
          </button>

          <button
            type="button"
            class="control"
            onclick="resetGame()"
          >
            Reset
          </button>

        </div>
      </section>

      <aside class="word-panel">

        <h2>Words to Find</h2>

        <p id="hint-description"></p>

        <ul
          id="word-list"
          class="word-list"
        ></ul>

        <p
          id="word-count"
          class="word-count"
        >
          Found 0 of 5
        </p>

      </aside>

    </div>
  </main>

  <script>
    const words = ${JSON.stringify(words)};
    const gridData = ${JSON.stringify(grid)};

    const difficulty = ${JSON.stringify(difficulty)};
    const showHints = ${JSON.stringify(showHints)};

    let selectedCells = [];
    let foundWords = [];

    const gridElement =
      document.getElementById("grid");

    const message =
      document.getElementById("message");

    const wordList =
      document.getElementById("word-list");

    const wordCount =
      document.getElementById("word-count");

    const hintDescription =
      document.getElementById("hint-description");

    function createGrid() {
      gridElement.innerHTML = "";

      gridData.forEach(function(row, rowIndex) {
        row.forEach(function(symbol, columnIndex) {

          const id = rowIndex + "-" + columnIndex;

          const button =
            document.createElement("button");

          button.type = "button";
          button.className = "cell";
          button.textContent = symbol;

          button.setAttribute(
            "aria-label",
            "Phoneme " +
              symbol +
              ", row " +
              (rowIndex + 1) +
              ", column " +
              (columnIndex + 1)
          );

          button.addEventListener(
            "click",
            function() {
              selectCell(
                id,
                button
              );
            }
          );

          gridElement.appendChild(button);
        });
      });
    }

    function selectCell(id, button) {

      const index =
        selectedCells.indexOf(id);

      if (index !== -1) {

        selectedCells.splice(
          index,
          1
        );

        button.classList.remove(
          "selected"
        );

        button.setAttribute(
          "aria-pressed",
          "false"
        );

      } else {

        selectedCells.push(id);

        button.classList.add(
          "selected"
        );

        button.setAttribute(
          "aria-pressed",
          "true"
        );
      }
    }

    function selectedSymbols() {

      return selectedCells.map(
        function(id) {

          const parts =
            id.split("-");

          const row =
            Number(parts[0]);

          const column =
            Number(parts[1]);

          return gridData[row][column];
        }
      );
    }

    function checkSelection() {

      const symbols =
        selectedSymbols();

      const selectedWord =
        symbols.join("");

      const match =
        words.find(function(word) {
          return (
            word.phonemes.join("") ===
            selectedWord
          );
        });

      if (match) {

        if (
          foundWords.indexOf(
            match.english
          ) === -1
        ) {

          foundWords.push(
            match.english
          );

          message.textContent =
            "Found! /" +
            match.phonemes.join(" ") +
            "/ = " +
            match.english;

        } else {

          message.textContent =
            match.english +
            " has already been found.";
        }

      } else {

        message.textContent =
          "That selection does not match a word. Try again.";
      }

      clearSelectedCells();
      renderWordList();
    }

    function clearSelectedCells() {

      selectedCells = [];

      document
        .querySelectorAll(
          ".cell.selected"
        )
        .forEach(function(cell) {

          cell.classList.remove(
            "selected"
          );

          cell.setAttribute(
            "aria-pressed",
            "false"
          );
        });
    }

    function clearSelection() {

      clearSelectedCells();

      message.textContent =
        "Selection cleared.";
    }

    function renderWordList() {

      wordList.innerHTML = "";

      words.forEach(function(word) {

        const found =
          foundWords.indexOf(
            word.english
          ) !== -1;

        const item =
          document.createElement("li");

        if (found) {
          item.className = "found";
        }

        const phonemeText =
          document.createElement("strong");

        const englishText =
          document.createElement("span");

        if (found) {

          phonemeText.textContent =
            "/" +
            word.phonemes.join(" ") +
            "/";

          englishText.textContent =
            word.english + " ✓";

        } else if (!showHints) {

          phonemeText.textContent =
            "Hidden word";

          englishText.textContent =
            "Not found";

        } else if (
          difficulty === "easy"
        ) {

          phonemeText.textContent =
            "/" +
            word.phonemes.join(" ") +
            "/";

          englishText.textContent =
            word.english;

        } else if (
          difficulty === "medium"
        ) {

          phonemeText.textContent =
            "/" +
            word.phonemes.join(" ") +
            "/";

          englishText.textContent =
            "English answer hidden";

        } else {

          phonemeText.textContent =
            "Hidden word";

          englishText.textContent =
            "Not found";
        }

        item.appendChild(
          phonemeText
        );

        item.appendChild(
          englishText
        );

        wordList.appendChild(
          item
        );
      });

      wordCount.textContent =
        "Found " +
        foundWords.length +
        " of " +
        words.length;

      if (!showHints) {

        hintDescription.textContent =
          "Find each hidden phoneme word.";

      } else if (
        difficulty === "easy"
      ) {

        hintDescription.textContent =
          "Use the English words and phoneme forms as hints.";

      } else if (
        difficulty === "medium"
      ) {

        hintDescription.textContent =
          "Use the phoneme forms as hints.";

      } else {

        hintDescription.textContent =
          "Find each word without a word list hint.";
      }
    }

    function resetGame() {

      foundWords = [];

      clearSelectedCells();

      message.textContent =
        "Select phonemes in the grid to find a word.";

      renderWordList();
    }

    createGrid();
    renderWordList();
  </script>

</body>
</html>`;
}