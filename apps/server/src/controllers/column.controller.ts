import {
  ColumnCreateInput,
  Column,
  ServerEvents,
  SocketIOServer,
  SocketIOSocket,
} from "@trello-clone/types";
import { NextFunction, Request, Response } from "express";
import { getErrorMessage } from "../helpers";
import ColumnModel from "../models/column.schema";
import { ColumnDocument } from "../types/column.interface";
import { GetColumnRequest } from "../types/request.interface";

export const normalizeColumn = (column: ColumnDocument & {}): Column => {
  return {
    id: column._id.toString(),
    title: column.title,
    userId: column.userId.toString(),
    boardId: column.boardId.toString(),
    createdAt: column.createdAt,
    updatedAt: column.updatedAt,
  };
};

export const list = async (
  req: GetColumnRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    try {
      const columns = await ColumnModel.find({ boardId: req.params.id });
      return res.json(columns.map(normalizeColumn));
    } catch (err: any) {
      return res.status(401).json({
        message: `Internal error fetching columns for baord ${req.params.id}, try again later`,
      });
    }
  } else {
    return res.status(401).json({ message: "Login to view a board" });
  }
};

export const create = async (
  io: SocketIOServer,
  socket: SocketIOSocket,
  { boardId, title }: ColumnCreateInput
) => {
  try {
    if (socket.data.user) {
      const column = await ColumnModel.create({
        title,
        userId: socket.data.user.id,
        boardId,
      });
      socket
        .to(boardId)
        .emit(ServerEvents.ColumnCreateSuccess, normalizeColumn(column));
    } else {
      socket.emit(ServerEvents.ColumnCreateFailure, "Login to create a column");
    }
  } catch (err) {
    socket.emit(ServerEvents.ColumnCreateFailure, getErrorMessage(err));
  }
};
