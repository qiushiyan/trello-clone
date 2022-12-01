import { NextFunction, Response } from "express";
import Board from "../models/board.schema";
import { BoardDcoument } from "../types/board.interface";
import { CreateBoardRequest, ExpressRequest } from "../types/request.interface";

const normalizeBoard = (board: BoardDcoument) => {
  return {
    id: board._id,
    title: board.title,
    description: board.description,
    userId: board.userId,
    createdAt: board.createdAt,
    updatedAt: board.updatedAt,
  };
};

export const list = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user) {
      const boards = (await Board.find({ userId: req.user._id })).map(
        normalizeBoard
      );
      return res.json(boards);
    } else {
      return res.status(401).json({ message: "Login to view your boards" });
    }
  } catch (any) {
    return res.status(401).json({
      message: "Internal error fetching your boards, try again later",
    });
  }
};

export const create = async (
  req: CreateBoardRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user) {
      const board = await Board.create({
        ...req.body,
        userId: req.user._id,
      });
      return res.json(normalizeBoard(board));
    } else {
      return res.status(401).json({ message: "Login to create a new board" });
    }
  } catch (any) {
    return res.status(401).json({
      message: "Internal error creating your board, try again later",
    });
  }
};
