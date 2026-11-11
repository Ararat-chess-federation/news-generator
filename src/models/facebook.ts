import type { NewsStatus } from "./news";

export interface IFacebookPost {
    id: string;
    message?: string;
    created_time: string;
    is_published?: boolean;
}

export interface INewsKey {
    type: "result" | "ad";
    place: string;
    category: string;
    terms: string[];
}

export interface IFacebookStatus {
    configured: boolean;
    status: NewsStatus;
    postId?: string;
    postUrl?: string;
    postedAt?: string;
    error?: string;
}

export interface ISaveDraftResult {
    status: "created" | "duplicate" | "error";
    message: string;
    postId?: string;
    postUrl?: string;
    postedAt?: string;
}
