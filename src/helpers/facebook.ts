import type { IFacebookPost, IFacebookStatus, INewsKey } from "../models/facebook";
import type { NewsStatus } from "../models/news";
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

async function uploadPhoto(image: File): Promise<string> {
    const body = new FormData();
    body.append("source", image, image.name);
    body.append("published", "false");
    body.append("temporary", "true");

    const { id } = await graphRequest<{ id: string }>("/photos", { method: "POST", body });
    return id;
}

export async function createDraftPost(message: string, key: INewsKey, images: File[] = []): Promise<string> {
    const photoIds = await Promise.all(images.map(uploadPhoto));
    const params = new URLSearchParams({ message, published: "false", unpublished_content_type: "DRAFT" });
    photoIds.forEach((photoId, index) => {
        params.append(`attached_media[${index}]`, JSON.stringify({ media_fbid: photoId }));
    });

    const { id } = await graphRequest<{ id: string }>("/feed", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
    });
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

export function normalize(text: string) {
    return text.replace(/\s+/g, " ").trim().toLowerCase();
}

export function extractCategory(text: string) {
    return normalize(text.match(/\d+-(?:րդ|ին) կարգ/)?.[0] ?? "");
}

export function getNewsKey(tournaments: ITournament[]): INewsKey {
    const { tournament, place = "" } = parseTournamentTitle(tournaments[0].title);
    const surnames = tournaments
        .flatMap(({ prizes }) => [prizes?.first, prizes?.second, prizes?.third])
        .map((prizer) => prizer?.player?.replace(/,/g, " ").trim().split(/\s+/)[0] ?? "")
        .filter((surname) => surname.length > 2);

    return {
        type: "result",
        place: normalize(place).split(" ").pop() ?? "",
        category: extractCategory(tournament),
        terms: [...new Set(surnames.map(normalize))],
    };
}

export function findDuplicatePost(key: INewsKey, posts: IFacebookPost[]): IFacebookPost | undefined {
    if (!key.place || !key.terms.length) {
        return undefined;
    }

    const requiredTerms = key.type === "ad" ? key.terms.length : Math.min(2, key.terms.length);

    return posts.find((post) => {
        const message = normalize(post.message ?? "");
        const foundTerms = key.terms.filter((term) => message.includes(term)).length;

        return message.includes(key.place)
            && (!key.category || message.includes(key.category))
            && foundTerms >= requiredTerms;
    });
}

function isSameNews(a: INewsKey, b: INewsKey) {
    return a.type === b.type
        && a.place === b.place
        && a.category === b.category
        && a.terms.length === b.terms.length
        && a.terms.every((term) => b.terms.includes(term));
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

export function formatPostDate(date: string | Date) {
    return new Date(date).toLocaleDateString("hy-AM", { day: "numeric", month: "long", year: "numeric" });
}

export function getPostUrl(status: NewsStatus, postId?: string) {
    if (status === "published" && postId) {
        return `https://www.facebook.com/${postId}`;
    }
    if (status === "draft") {
        return `https://business.facebook.com/latest/posts?asset_id=${process.env.FB_PAGE_ID}`;
    }
    return undefined;
}

export function toFacebookStatus(existing: IFacebookPost | undefined): IFacebookStatus {
    const status: NewsStatus = existing ? (existing.is_published === false ? "draft" : "published") : "new";

    return {
        configured: true,
        status,
        postId: existing?.id,
        postUrl: getPostUrl(status, existing?.id),
        postedAt: existing?.created_time ? formatPostDate(existing.created_time) : undefined,
    };
}
