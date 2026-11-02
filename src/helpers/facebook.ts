import type { IFacebookPost, INewsKey } from "../models/facebook";
import type { ITournament } from "../models/tournament";
import { addSavedDraft, readSavedDrafts, removeSavedDrafts } from "./draftStore";
import { parseTournamentTitle } from "./parseTournamentTitle";

const RECENT_POSTS_LIMIT = 50;

export class FacebookApiError extends Error {
    code?: number;

    constructor(message: string, code?: number) {
        super(message);
        this.code = code;
        this.name = "FacebookApiError";
    }
}

export function isFacebookConfigured() {
    return Boolean(process.env.FB_PAGE_ID && process.env.FB_PAGE_ACCESS_TOKEN);
}

function graphUrl(path: string, node = process.env.FB_PAGE_ID) {
    const version = process.env.FB_GRAPH_VERSION || "v26.0";
    return `https://graph.facebook.com/${version}${node ? `/${node}` : ""}${path}`;
}

async function graphRequest<T>(path: string, init: RequestInit = {}, node?: string): Promise<T> {
    const res = await fetch(graphUrl(path, node), {
        ...init,
        headers: {
            ...init.headers,
            Authorization: `Bearer ${process.env.FB_PAGE_ACCESS_TOKEN}`,
        },
        cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.error) {
        throw new FacebookApiError(data.error?.message ?? `Facebook API error: ${res.status}`, data.error?.code);
    }

    return data as T;
}

export async function getRecentPosts(): Promise<IFacebookPost[]> {
    const params = new URLSearchParams({
        fields: "id,message,created_time,is_published",
        limit: String(RECENT_POSTS_LIMIT),
    });
    const { data } = await graphRequest<{ data: IFacebookPost[] }>(`/posts?${params}`);

    return data ?? [];
}

function postToFeed(params: Record<string, string>) {
    return graphRequest<{ id: string }>("/feed", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(params),
    });
}

export async function createDraftPost(message: string, key: INewsKey): Promise<string> {
    const { id } = await postToFeed({ message, published: "false", unpublished_content_type: "DRAFT" });
    await addSavedDraft(id, key);
    return id;
}

async function getPost(id: string): Promise<IFacebookPost | undefined> {
    try {
        return await graphRequest<IFacebookPost>(`/${id}?fields=id,message,created_time,is_published`, {}, "");
    } catch (error) {
        if (error instanceof FacebookApiError && (error.code === 100 || /does not exist/i.test(error.message))) {
            return undefined;
        }
        throw error;
    }
}

function normalize(text: string) {
    return text.replace(/\s+/g, " ").trim().toLowerCase();
}

export function getNewsKey(tournaments: ITournament[]): INewsKey {
    const { tournament, place = "" } = parseTournamentTitle(tournaments[0].title);
    const category = tournament.match(/\d+-(?:րդ|ին) կարգ/)?.[0] ?? "";
    const surnames = tournaments
        .flatMap(({ prizes }) => [prizes?.first, prizes?.second, prizes?.third])
        .map((prizer) => prizer?.player?.replace(/,/g, " ").trim().split(/\s+/)[0] ?? "")
        .filter((surname) => surname.length > 2);

    return {
        place: normalize(place).split(" ").pop() ?? "",
        category: normalize(category),
        surnames: [...new Set(surnames.map(normalize))],
    };
}

export function findDuplicatePost(key: INewsKey, posts: IFacebookPost[]): IFacebookPost | undefined {
    if (!key.place || !key.surnames.length) {
        return undefined;
    }

    const requiredSurnames = Math.min(2, key.surnames.length);

    return posts.find((post) => {
        const message = normalize(post.message ?? "");
        const foundSurnames = key.surnames.filter((surname) => message.includes(surname)).length;

        return message.includes(key.place)
            && (!key.category || message.includes(key.category))
            && foundSurnames >= requiredSurnames;
    });
}

function isSameNews(a: INewsKey, b: INewsKey) {
    return a.place === b.place
        && a.category === b.category
        && a.surnames.length === b.surnames.length
        && a.surnames.every((surname) => b.surnames.includes(surname));
}

export async function findExistingPost(key: INewsKey, posts: IFacebookPost[]): Promise<IFacebookPost | undefined> {
    const published = findDuplicatePost(key, posts);
    if (published) {
        return published;
    }

    const savedDrafts = (await readSavedDrafts()).filter((draft) => isSameNews(draft.key, key));
    const deletedIds: string[] = [];
    let existing: IFacebookPost | undefined;

    for (const draft of savedDrafts) {
        existing = await getPost(draft.postId);
        if (existing) {
            break;
        }
        deletedIds.push(draft.postId);
    }

    await removeSavedDrafts(deletedIds);

    return existing;
}
