export interface IFacebookPost {
    id: string;
    message?: string;
    created_time: string;
    is_published?: boolean;
}

export interface INewsKey {
    place: string;
    category: string;
    surnames: string[];
}

export interface ISaveDraftResult {
    status: "created" | "duplicate" | "error";
    message: string;
    postId?: string;
}
