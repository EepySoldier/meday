import { SQLiteDatabase } from "expo-sqlite";

export type CardType = "task" | "routine";
export type Repeat = "daily" | "weekly";

export type Card = {
  id: number;
  title: string;
  notes: string;
  type: CardType;
  repeat: Repeat;
  duration: number; // minutes, 0 means no timer
  steps: string[];
  color: string;
  position: number;
  doneAt: number | null;
};

// The data the New Card form gives us
export type CardInput = {
  title: string;
  notes: string;
  type: CardType;
  repeat: Repeat;
  duration: number;
  steps: string[];
  color: string;
};

type CardRow = {
  id: number;
  title: string;
  notes: string;
  type: string;
  repeat: string;
  duration: number;
  steps: string;
  color: string;
  position: number;
  done_at: number | null;
};

function rowToCard(row: CardRow): Card {
  return {
    id: row.id,
    title: row.title,
    notes: row.notes,
    type: row.type as CardType,
    repeat: row.repeat as Repeat,
    duration: row.duration,
    steps: JSON.parse(row.steps),
    color: row.color,
    position: row.position,
    doneAt: row.done_at,
  };
}

export async function getAllCards(db: SQLiteDatabase) {
  const rows = await db.getAllAsync<CardRow>(
    "SELECT * FROM cards ORDER BY position ASC"
  );
  return rows.map(rowToCard);
}

export async function getCard(db: SQLiteDatabase, id: number) {
  const row = await db.getFirstAsync<CardRow>(
    "SELECT * FROM cards WHERE id = ?",
    id
  );
  if (!row) {
    return null;
  }
  return rowToCard(row);
}

async function getNextPosition(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ maxPos: number | null }>(
    "SELECT MAX(position) AS maxPos FROM cards"
  );
  if (!row || row.maxPos === null) {
    return 0;
  }
  return row.maxPos + 1;
}

export async function addCard(db: SQLiteDatabase, card: CardInput) {
  const position = await getNextPosition(db);
  await db.runAsync(
    "INSERT INTO cards (title, notes, type, repeat, duration, steps, color, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    card.title,
    card.notes,
    card.type,
    card.repeat,
    card.duration,
    JSON.stringify(card.steps),
    card.color,
    position
  );
}

export async function updateCard(
  db: SQLiteDatabase,
  id: number,
  card: CardInput
) {
  await db.runAsync(
    "UPDATE cards SET title = ?, notes = ?, type = ?, repeat = ?, duration = ?, steps = ?, color = ? WHERE id = ?",
    card.title,
    card.notes,
    card.type,
    card.repeat,
    card.duration,
    JSON.stringify(card.steps),
    card.color,
    id
  );
}

export async function deleteCard(db: SQLiteDatabase, id: number) {
  await db.runAsync("DELETE FROM cards WHERE id = ?", id);
}

// "Later" - the card goes to the bottom of the deck
export async function moveCardToBack(db: SQLiteDatabase, id: number) {
  const position = await getNextPosition(db);
  await db.runAsync("UPDATE cards SET position = ? WHERE id = ?", position, id);
}

// Done cards stay in the database so we can count "done today".
// Routines come back the next day (or next week), tasks don't come back.
export async function markCardDone(db: SQLiteDatabase, id: number) {
  const position = await getNextPosition(db);
  await db.runAsync(
    "UPDATE cards SET done_at = ?, position = ? WHERE id = ?",
    Date.now(),
    position,
    id
  );
}

export async function eraseAllCards(db: SQLiteDatabase) {
  await db.runAsync("DELETE FROM cards");
}

export function getStartOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export function isDoneToday(card: Card) {
  return card.doneAt !== null && card.doneAt >= getStartOfToday();
}

// Should this card show up in the deck right now?
export function isCardInDeck(card: Card) {
  if (card.doneAt === null) {
    return true;
  }
  if (card.type === "task") {
    return false;
  }
  if (card.repeat === "daily") {
    return card.doneAt < getStartOfToday();
  }
  // weekly
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return card.doneAt < getStartOfToday() - oneWeek + 24 * 60 * 60 * 1000;
}

export async function addSampleCards(db: SQLiteDatabase) {
  const samples: CardInput[] = [
    {
      title: "Morning routine",
      notes: "Start slow. No phone until the last step.",
      type: "routine",
      repeat: "daily",
      duration: 20,
      steps: ["Glass of water", "Stretch for 5 minutes", "Make the bed", "Plan the day"],
      color: "peach",
    },
    {
      title: "Read 20 pages",
      notes: "The book on the nightstand.",
      type: "task",
      repeat: "daily",
      duration: 25,
      steps: [],
      color: "lavender",
    },
    {
      title: "Evening walk",
      notes: "",
      type: "routine",
      repeat: "daily",
      duration: 30,
      steps: ["Put on shoes", "Loop around the park"],
      color: "mint",
    },
    {
      title: "Clean the desk",
      notes: "Just the top. Drawers can wait.",
      type: "task",
      repeat: "daily",
      duration: 10,
      steps: [],
      color: "blue",
    },
    {
      title: "Call grandma",
      notes: "",
      type: "task",
      repeat: "daily",
      duration: 0,
      steps: [],
      color: "pink",
    },
    {
      title: "Weekly review",
      notes: "Look back at the week and plan the next one.",
      type: "routine",
      repeat: "weekly",
      duration: 45,
      steps: ["Empty the inbox", "Check the calendar", "Pick 3 goals"],
      color: "yellow",
    },
  ];

  for (const card of samples) {
    await addCard(db, card);
  }
}
