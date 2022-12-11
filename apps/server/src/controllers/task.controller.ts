import { NextFunction, Response } from "express";
import { CreateTaskRequest, GetTasksRequest } from "../types/request.interface";
import TaskModel from "../models/task.schema";
import {
  CreateTaskInput,
  ServerEvents,
  SocketIOServer,
  SocketIOSocket,
  Task,
} from "@trello-clone/types";
import { TaskDocument } from "../types/task.interface";
import { getErrorMessage } from "../helpers";

export const normalizeTask = (task: TaskDocument): Task => {
  return {
    id: task._id.toString() as string,
    title: task.title,
    userId: task.userId.toString(),
    boardId: task.boardId.toString(),
    columnId: task.columnId.toString(),
    attachments: task.attachments,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
};

export const list = async (
  req: GetTasksRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user) {
    try {
      const tasks = await TaskModel.find({ boardId: req.params.boardId });
      return res.json(tasks.map(normalizeTask));
    } catch (err: unknown) {
      return res.status(401).json({
        message: `Internal error fetching tasks for baord ${req.params.boardId}, try again later`,
      });
    }
  } else {
    return res.status(401).json({ message: "Login to view a board" });
  }
};

export const create = async (
  io: SocketIOServer,
  socket: SocketIOSocket,
  input: CreateTaskInput
) => {
  try {
    if (socket.data.user) {
      const task = await TaskModel.create({
        ...input,
        userId: socket.data.user.id,
      });
      io.to(input.boardId).emit(
        ServerEvents.TasksCreateSuccess,
        normalizeTask(task)
      );
    } else {
      socket.emit(ServerEvents.TasksCreateFailure, "Login to create a task");
    }
  } catch (err) {
    socket.emit(ServerEvents.TasksCreateFailure, getErrorMessage(err));
  }
};
