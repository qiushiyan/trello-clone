import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import { startDb } from "./db";
import dotenv from "dotenv";
import cors from "cors";
import { authRouter } from "./routers/auth.router";
import { boardRouter } from "./routers/board.router";
import * as BoardController from "./controllers/board.controller";
import * as ColumnController from "./controllers/column.controller";
import * as TaskController from "./controllers/task.controller";
import { ClientEvents, SocketIOServer } from "@trello-clone/types";
import socketioMiddleware from "./middlewares/socketio.middleware";

dotenv.config();
const app = express();
const httpServer = createServer(app);
const io: SocketIOServer = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4200",
  },
});
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());
app.use("/api/users", authRouter);
app.use("/api/boards", boardRouter);
app.get("/", (req, res) => {
  return res.send("hello world");
});

io.use(socketioMiddleware).on("connection", (socket) => {
  socket.on(ClientEvents.BoardsJoin, ({ boardId }) => {
    BoardController.joinBoard(io, socket, boardId);
  });

  socket.on(ClientEvents.BoardsLeave, ({ boardId }) => {
    BoardController.leaveBoard(io, socket, boardId);
  });

  socket.on(ClientEvents.BoardsUpdate, (data) => {
    BoardController.updateBoard(io, socket, data);
  });

  socket.on(ClientEvents.BoardsDelete, (data) => {
    BoardController.deleteBoard(io, socket, data);
  });

  socket.on(ClientEvents.ColumnsCreate, (data) => {
    ColumnController.create(io, socket, data);
  });

  socket.on(ClientEvents.ColumnsUpdate, (data) => {
    ColumnController.update(io, socket, data);
  });

  socket.on(ClientEvents.ColumnsDelete, (data) => {
    ColumnController.delete_(io, socket, data);
  });

  socket.on(ClientEvents.TasksCreate, (data) => {
    TaskController.create(io, socket, data);
  });

  socket.on(ClientEvents.TasksUpdate, (data) => {
    TaskController.update(io, socket, data);
  });

  socket.on(ClientEvents.TasksDelete, (data) => {
    TaskController.delete_(io, socket, data);
  });
});

const bootstrap = async () => {
  await startDb();
  httpServer.listen(port, () => {
    console.log(`Server listening on http://localhost:${port} 🚀`);
  });
};

bootstrap();
