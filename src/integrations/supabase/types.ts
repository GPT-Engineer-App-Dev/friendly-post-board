export type Post = {
    id: number;
    title: string;
    body: string;
    created_at: string;
    author_id: string;
    reactions?: Reaction[];
};

export type Reaction = {
    id: number;
    post_id: number;
    user_id: string;
    emoji: string;
};