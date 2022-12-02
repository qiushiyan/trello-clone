import { NextFunction, Response } from "express";
import Board from "../models/board.schema";
import { BoardDcoument } from "../types/board.interface";
import {
  CreateBoardRequest,
  ExpressRequest,
  GetBoardRequest,
} from "../types/request.interface";
import { Error as MongooseError } from "mongoose";

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
  if (req.user) {
    try {
      const boards = (await Board.find({ userId: req.user._id })).map(
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
      console.log(board?.userId, req.user._id);
      if (board && board.userId.toString() === req.user._id.toString()) {
        return res.json(normalizeBoard(board));
      } else {
        return res.status(404).json({ message: "Board not found" });
      }
    } catch (err: any) {
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
        userId: req.user._id,
      });
      return res.json(normalizeBoard(board));
    } catch (any) {
      return res.status(401).json({
        message: "Internal error creating your board, try again later",
      });
    }
  } else {
    return res.status(401).json({ message: "Login to create a new board" });
  }
};
