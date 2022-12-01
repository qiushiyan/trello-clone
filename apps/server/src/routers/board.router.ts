import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import * as BoardController from "../controllers/board.controller";

// prefix /api/boards
const boardRouter = Router();

boardRouter.use(authMiddleware);
boardRouter.get("/", BoardController.list);
boardRouter.post("/new", BoardController.create);

export { boardRouter };
