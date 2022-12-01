import { Schema, Document } from "mongoose";

export interface Board {
  title: string;
  userId: Schema.Types.ObjectId;
  description?: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface BoardDcoument extends Board, Document {}
