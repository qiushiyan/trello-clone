import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import * as userController from "./controllers/user.controller";
import { startDb } from "./db";
import dotenv from "dotenv";
import authMiddleware from "./middlewares/auth";

dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/api/users/new", userController.register);
app.post("/api/users/login", userController.login);
app.use("/api/users/me", authMiddleware, userController.currentUser);

io.on("connection", (socket) => {
  console.log(`websocket connected ${socket.id}`);
});

const bootstrap = async () => {
  await startDb();
  httpServer.listen(port, () => {
    console.log(`Server listening on http://localhost:${port} 🚀`);
  });
};

bootstrap();
