import { model, Schema } from "mongoose";
import { ColumnDocument } from "../types/column.interface";

const ColumnSchema = new Schema<ColumnDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<ColumnDocument>("Column", ColumnSchema);
