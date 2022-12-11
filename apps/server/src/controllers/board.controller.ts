import { NextFunction, Response } from "express";
import Board from "../models/board.schema";
import { BoardDcoument } from "../types/board.interface";
import {
  CreateBoardRequest,
  ExpressRequest,
  GetBoardRequest,
} from "../types/request.interface";
import { Error as MongooseError } from "mongoose";
import {
  SocketIOSocket,
  SocketIOServer,
  ServerEvents,
  UpdateBoardInput,
  DeleteBoardInput,
} from "@trello-clone/types";
import { getErrorMessage } from "../helpers";

const normalizeBoard = (board: BoardDcoument) => {
  return {
    id: board._id.toString(),
    title: board.title,
    description: board.description,
    userId: board.userId.toString(),
    createdAt: board.createdAt,
    updatedAt: board.updatedAt,
  };
};

export const list = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    try {
      const boards = (await Board.find({ userId: req.user.id })).map(
        normalizeBoard
      );
      return res.json(boards);
    } catch (any) {
      return res.status(401).json({
        message: "Internal error fetching your boards, try again later",
      });
    }
  } else {
    res.status(401).json({ message: "Login to view boards" });
  }
};

export const get = async (
  req: GetBoardRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    try {
      const board = await Board.findById(req.params.id);
      if (board) {
        return res.json(normalizeBoard(board));
      } else {
        return res.status(404).json({ message: "Board not found" });
      }
    } catch (err: unknown) {
      if (err instanceof MongooseError.CastError) {
        return res.status(404).json({ message: "Board not found" });
      } else {
        return res.status(401).json({
          message: "Internal error creating your board, try again later",
        });
      }
    }
  } else {
    return res.status(401).json({ message: "Login to view a board" });
  }
};

export const create = async (
  req: CreateBoardRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    try {
      const board = await Board.create({
        ...req.body,
        userId: req.user.id,
      });
      return res.json(normalizeBoard(board));
    } catch (err: unknown) {
      return res.status(401).json({
        message: "Internal error creating your board, try again later",
      });
    }
  } else {
    return res.status(401).json({ message: "Login to create a new board" });
  }
};

export const joinBoard = (
  io: SocketIOServer,
  socket: SocketIOSocket,
  boardId: string
) => {
  socket.join(boardId);
};

export const leaveBoard = (
  io: SocketIOServer,
  socket: SocketIOSocket,
  boardId: string
) => {
  socket.leave(boardId);
};

export const updateBoard = async (
  io: SocketIOServer,
  socket: SocketIOSocket,
  input: UpdateBoardInput
) => {
  try {
    if (!socket.data.user) {
      throw new Error("Log in to edit a board");
    }

    const updatedBoard = await Board.findByIdAndUpdate(input.id, input.fields, {
      new: true,
    });
    if (!updatedBoard) {
      throw new Error("Board not found");
    }
    io.to(input.id).emit(
      ServerEvents.BoardsUpdateSuccess,
      normalizeBoard(updatedBoard)
    );
  } catch (err: unknown) {
    socket.emit(ServerEvents.BoardsUpdateFailure, getErrorMessage(err));
  }
};

export const deleteBoard = async (
  io: SocketIOServer,
  socket: SocketIOSocket,
  input: DeleteBoardInput
) => {
  try {
    if (!socket.data.user) {
      throw new Error("Log in to edit a board");
    }

    await Board.findOneAndDelete({ _id: input.id });
    io.to(input.id).emit(ServerEvents.BoardsDeleteSuccess);
  } catch (err: unknown) {
    socket.emit(ServerEvents.BoardsDeleteFailure, getErrorMessage(err));
  }
};
