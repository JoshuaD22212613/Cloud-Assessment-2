import { db } from "../../../../prisma/db";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET - Retrieve one word and its phonemes
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const wordId = Number(id);

    if (!Number.isInteger(wordId) || wordId <= 0) {
      return Response.json(
        { error: "Invalid word ID" },
        { status: 400 }
      );
    }

    const word = await db.orm.public.Word
      .where({ id: wordId })
      .first();

    if (!word) {
      return Response.json(
        { error: "Word not found" },
        { status: 404 }
      );
    }

    const phonemes = await db.orm.public.Phoneme
      .where({ wordId })
      .orderBy((phoneme) => phoneme.position.asc())
      .all();

    return Response.json(
      {
        ...word,
        phonemes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to retrieve word:", error);

    return Response.json(
      { error: "Failed to retrieve word" },
      { status: 500 }
    );
  }
}

// PUT - Update one word and replace its phonemes
export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const wordId = Number(id);

    if (!Number.isInteger(wordId) || wordId <= 0) {
      return Response.json(
        { error: "Invalid word ID" },
        { status: 400 }
      );
    }

    const existingWord = await db.orm.public.Word
      .where({ id: wordId })
      .first();

    if (!existingWord) {
      return Response.json(
        { error: "Word not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const text =
      typeof body.text === "string" ? body.text.trim() : "";

    const hint =
      typeof body.hint === "string" ? body.hint.trim() : null;

    const wordListId = Number(body.wordListId);

    if (!text) {
      return Response.json(
        { error: "Word text is required" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(wordListId) || wordListId <= 0) {
      return Response.json(
        { error: "Valid word list ID is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.phonemes) || body.phonemes.length === 0) {
      return Response.json(
        { error: "At least one phoneme is required" },
        { status: 400 }
      );
    }

    const phonemeSymbols = body.phonemes.map((phoneme: unknown) =>
      typeof phoneme === "string" ? phoneme.trim() : ""
    );

    if (phonemeSymbols.some((phoneme: string) => !phoneme)) {
      return Response.json(
        { error: "All phonemes must be non-empty strings" },
        { status: 400 }
      );
    }

    const wordList = await db.orm.public.WordList
      .where({ id: wordListId })
      .first();

    if (!wordList) {
      return Response.json(
        { error: "Word list not found" },
        { status: 404 }
      );
    }

    const updatedWord = await db.orm.public.Word
      .where({ id: wordId })
      .update({
        text,
        hint: hint || null,
        wordListId,
      });

    // Remove old phonemes
    const oldPhonemes = await db.orm.public.Phoneme
      .where({ wordId })
      .all();

    for (const phoneme of oldPhonemes) {
      await db.orm.public.Phoneme
        .where({ id: phoneme.id })
        .delete();
    }

    // Create replacement phonemes
    const phonemes = [];

    for (let position = 0; position < phonemeSymbols.length; position++) {
      const phoneme = await db.orm.public.Phoneme.create({
        symbol: phonemeSymbols[position],
        position,
        wordId,
      });

      phonemes.push(phoneme);
    }

    return Response.json(
      {
        ...updatedWord,
        phonemes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update word:", error);

    return Response.json(
      { error: "Failed to update word" },
      { status: 500 }
    );
  }
}

// DELETE - Delete one word
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const wordId = Number(id);

    if (!Number.isInteger(wordId) || wordId <= 0) {
      return Response.json(
        { error: "Invalid word ID" },
        { status: 400 }
      );
    }

    const existingWord = await db.orm.public.Word
      .where({ id: wordId })
      .first();

    if (!existingWord) {
      return Response.json(
        { error: "Word not found" },
        { status: 404 }
      );
    }

    await db.orm.public.Word
      .where({ id: wordId })
      .delete();

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete word:", error);

    return Response.json(
      { error: "Failed to delete word" },
      { status: 500 }
    );
  }
}