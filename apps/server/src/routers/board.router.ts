import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import * as BoardController from "../controllers/board.controller";
import * as ColumnController from "../controllers/column.controller";

// prefix /api/boards
const boardRouter = Router();

boardRouter.use(authMiddleware);
boardRouter.get("/:id", BoardController.get);
boardRouter.get("/:id/columns", ColumnController.list);
boardRouter.get("/", BoardController.list);
boardRouter.post("/new", BoardController.create);

export { boardRouter };
