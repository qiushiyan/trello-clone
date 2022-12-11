export interface Task {
    id: string;
    title: string;
    description?: string;
    attachments: string[];
    userId: string;
    boardId: string;
    columnId: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreateTaskInput {
    title: string;
    boardId: string;
    columnId: string;
    description?: string;
    attachments?: string[];
}
export interface GetTasksInput {
    boardId: string;
}
