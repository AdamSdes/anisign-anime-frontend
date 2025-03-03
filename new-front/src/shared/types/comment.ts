export interface Comment {
    user: any;
    rating: any;
    id: string;
    user_id: string;
    username: string;
    text: string;
    likes: string;
    created_at: string;
}

export interface CommentResponse {
    commments: Comment[];
    total: number;
    total_count: number;
    page: number;
    pages: number;
}