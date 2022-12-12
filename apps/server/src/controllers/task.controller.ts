import { NextFunction, Response } from "express";
import { CreateTaskRequest, GetTasksRequest } from "../types/request.interface";
import TaskModel from "../models/task.schema";
import {
  CreateTaskInput,
  DeleteTaskInput,
  ServerEvents,
  SocketIOServer,
  SocketIOSocket,
  Task,
  UpdateTaskInput,
} from "@trello-clone/types";
import { TaskDocument } from "../types/task.interface";
import { getErrorMessage } from "../helpers";

export const normalizeTask = (task: TaskDocument): Task => {
  return {
    id: task._id.toString() as string,
    title: task.title,
    description: task.description,
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

export const update = async (
  io: SocketIOServer,
  socket: SocketIOSocket,
  input: UpdateTaskInput
) => {
  try {
    if (socket.data.user) {
      const task = await TaskModel.findByIdAndUpdate(input.id, input.fields, {
        new: true,
      });
      if (!task) {
        throw new Error("Task not found");
      }
      io.to(task.boardId.toString()).emit(
        ServerEvents.TasksUpdateSuccess,
        normalizeTask(task)
      );
    } else {
      socket.emit(ServerEvents.TasksUpdateFailure, "Login to update a task");
    }
  } catch (err) {
    socket.emit(ServerEvents.TasksUpdateFailure, getErrorMessage(err));
  }
};

export const delete_ = async (
  io: SocketIOServer,
  socket: SocketIOSocket,
  input: DeleteTaskInput
) => {
  try {
    if (socket.data.user) {
      const deletedTask = await TaskModel.findOneAndDelete({
        _id: input.id,
      });
      if (!deletedTask) {
        throw new Error("Task not found");
      }
      io.to(deletedTask.boardId.toString()).emit(
        ServerEvents.TasksDeleteSuccess,
        normalizeTask(deletedTask)
      );
    } else {
      socket.emit(ServerEvents.TasksDeleteFailure, "Login to delete a task");
    }
  } catch (err) {
    socket.emit(ServerEvents.TasksDeleteFailure, getErrorMessage(err));
  }
};
