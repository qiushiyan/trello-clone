// normalized columm
export interface Column {
  id: string;
  title: string;
  boardId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateColumnInput {
  boardId: string;
  title: string;
}

// only
export interface GetColumnInput {
  boardId: string;
}
