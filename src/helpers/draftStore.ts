import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { INewsKey } from "../models/facebook";

export interface ISavedDraft {
    postId: string;
    key: INewsKey;
    createdAt: string;
}

const MAX_AGE_DAYS = 120;

function migrateKey(key: INewsKey & { surnames?: string[] }): INewsKey {
    return {
        type: key.type ?? "result",
        place: key.place,
        category: key.category,
        terms: key.terms ?? key.surnames ?? [],
    };
}

function storePath() {
    return path.join(process.cwd(), "data", "facebook-drafts.json");
}

export async function readSavedDrafts(): Promise<ISavedDraft[]> {
    try {
        const drafts: ISavedDraft[] = JSON.parse(await readFile(storePath(), "utf8"));
        const minDate = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
        return drafts
            .filter((draft) => new Date(draft.createdAt).getTime() > minDate)
            .map((draft) => ({ ...draft, key: migrateKey(draft.key) }));
    } catch {
        return [];
    }
}

async function writeSavedDrafts(drafts: ISavedDraft[]) {
    const file = storePath();
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, JSON.stringify(drafts, null, 2));
}

export async function addSavedDraft(postId: string, key: INewsKey) {
    const drafts = await readSavedDrafts();
    drafts.push({ postId, key, createdAt: new Date().toISOString() });
    await writeSavedDrafts(drafts);
}

export async function removeSavedDrafts(postIds: string[]) {
    if (!postIds.length) {
        return;
    }
    const drafts = await readSavedDrafts();
    await writeSavedDrafts(drafts.filter((draft) => !postIds.includes(draft.postId)));
}
