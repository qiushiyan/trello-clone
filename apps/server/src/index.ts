import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import { startDb } from "./db";
import dotenv from "dotenv";
import cors from "cors";
import { authRouter } from "./routers/auth.router";

dotenv.config();
const app = express();
const httpServer = createServer(app);
// const io = new Server(httpServer, {});
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());
app.use("/api/users", authRouter);

app.get("/", (req, res) => {
  return res.send("hello world");
});

// io.on("connection", (socket) => {
//   console.log(`websocket connected ${socket.id}`);
// });

const bootstrap = async () => {
  await startDb();
  httpServer.listen(port, () => {
    console.log(`Server listening on http://localhost:${port} 🚀`);
  });
};

bootstrap();
