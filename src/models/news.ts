export type NewsStatus = "new" | "draft" | "published" | "unknown";

export interface INewsItem {
    id: string;
    tournaments: { title: string; link: string }[];
    text: string;
    status: NewsStatus;
    postId?: string;
    postedAt?: string;
}
