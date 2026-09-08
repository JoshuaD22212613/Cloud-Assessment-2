import { db } from "../../../../prisma/db";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET - Retrieve one word list
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const wordListId = Number(id);

    // Validate the ID
    if (!Number.isInteger(wordListId) || wordListId <= 0) {
      return Response.json(
        { error: "Invalid word list ID" },
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

    return Response.json(wordList, { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve word list:", error);

    return Response.json(
      { error: "Failed to retrieve word list" },
      { status: 500 }
    );
  }
}

// PUT - Update one word list
export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const wordListId = Number(id);

    // Validate the ID
    if (!Number.isInteger(wordListId) || wordListId <= 0) {
      return Response.json(
        { error: "Invalid word list ID" },
        { status: 400 }
      );
    }

    // Check that the word list exists
    const existingWordList = await db.orm.public.WordList
      .where({ id: wordListId })
      .first();

    if (!existingWordList) {
      return Response.json(
        { error: "Word list not found" },
        { status: 404 }
      );
    }

    // Safely read the JSON request body
    let body;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "Request body must contain valid JSON" },
        { status: 400 }
      );
    }

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null;

    // Validate the word list name
    if (!name) {
      return Response.json(
        { error: "Word list name is required" },
        { status: 400 }
      );
    }

    // Update the word list
    const updatedWordList = await db.orm.public.WordList
      .where({ id: wordListId })
      .update({
        name,
        description: description || null,
      });

    return Response.json(updatedWordList, { status: 200 });
  } catch (error) {
    console.error("Failed to update word list:", error);

    return Response.json(
      { error: "Failed to update word list" },
      { status: 500 }
    );
  }
}

// DELETE - Delete one word list
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const wordListId = Number(id);

    // Validate the ID
    if (!Number.isInteger(wordListId) || wordListId <= 0) {
      return Response.json(
        { error: "Invalid word list ID" },
        { status: 400 }
      );
    }

    // Check that the word list exists
    const existingWordList = await db.orm.public.WordList
      .where({ id: wordListId })
      .first();

    if (!existingWordList) {
      return Response.json(
        { error: "Word list not found" },
        { status: 404 }
      );
    }

    // Delete the word list
    await db.orm.public.WordList
      .where({ id: wordListId })
      .delete();

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete word list:", error);

    return Response.json(
      { error: "Failed to delete word list" },
      { status: 500 }
    );
  }
}