import { Schema, Document } from "mongoose";

// Column type for mongoose
// there is also a (normalized )Column type for network requests in the types package
export interface Column {
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: Schema.Types.ObjectId;
  boardId: Schema.Types.ObjectId;
}

export interface ColumnDocument extends Document, Column {}
