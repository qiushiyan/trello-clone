export interface CreateBoardInput {
    title: string;
    description?: string;
}
export interface Board {
    id: string;
    title: string;
    description?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface GetBoardInput {
    id: string;
}
export interface DeleteBoardInput {
    id: string;
}
export interface UpdateBoardInput {
    id: string;
    fields: {
        title?: string;
        description?: string;
    };
}
