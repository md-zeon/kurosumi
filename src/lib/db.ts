import Dexie, { type Table } from 'dexie';

export interface Note {
  id?: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  pinned?: boolean;
  folderId?: number;
}

class KurosumiDatabase extends Dexie {
  notes!: Table<Note>;

  constructor() {
    super('kurosumi');
    this.version(1).stores({
      notes: '++id, title, createdAt, updatedAt, pinned, folderId',
    });
  }
}

export const db = new KurosumiDatabase();

// Note operations
export async function createNote(title: string = 'Untitled', content: string = ''): Promise<number> {
  return await db.notes.add({
    title,
    content,
    createdAt: new Date(),
    updatedAt: new Date(),
    pinned: false,
  });
}

export async function updateNote(id: number, updates: Partial<Note>): Promise<void> {
  await db.notes.update(id, {
    ...updates,
    updatedAt: new Date(),
  });
}

export async function deleteNote(id: number): Promise<void> {
  await db.notes.delete(id);
}

export async function getNote(id: number): Promise<Note | undefined> {
  return await db.notes.get(id);
}

export async function getAllNotes(): Promise<Note[]> {
  return await db.notes.orderBy('updatedAt').reverse().toArray();
}

export async function searchNotes(query: string): Promise<Note[]> {
  const lowerQuery = query.toLowerCase();
  return await db.notes
    .filter(
      (note) =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery)
    )
    .toArray();
}

export async function togglePin(id: number): Promise<void> {
  const note = await db.notes.get(id);
  if (note) {
    await db.notes.update(id, { pinned: !note.pinned });
  }
}
