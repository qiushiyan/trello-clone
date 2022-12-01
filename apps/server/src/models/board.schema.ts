import { model, Schema } from "mongoose";
import { BoardDcoument } from "../types/board.interface";

const boardSchema = new Schema<BoardDcoument>(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default model<BoardDcoument>("Board", boardSchema);
