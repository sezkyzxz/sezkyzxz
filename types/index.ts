export interface Project {
    id: number;
    title: string;
    description: string | null;
    category: string | null;
    thumbnail_path: string | null;
    gallery?: string[] | null;
    project_url: string | null;
    tags: string | null;
    created_at: string;
    updated_at: string;
}

export interface Message {
    id: number;
    name: string;
    email: string;
    message: string;
    ip_hash: string | null;
    is_read: boolean;
    created_at: string;
}

export interface Comment {
    id: number;
    name: string;
    comment: string;
    avatar_url: string | null;
    created_at: string;
    is_approved?: boolean;
    is_pinned?: boolean;
    admin_reply?: string | null;
    replied_at?: string | null;
}

