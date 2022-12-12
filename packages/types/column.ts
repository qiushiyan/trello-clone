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

export interface DeleteColumnInput {
  id: string;
}

export interface UpdateColumnInput {
  id: string;
  fields: {
    title?: string;
  };
}

export interface GetColumnInput {
  boardId: string;
}
