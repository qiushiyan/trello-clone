import { Router } from "express";
import * as userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth";

// prefix /auth/users
const authRouter = Router();
authRouter.post("/new", userController.register);
authRouter.post("/login", userController.login);
authRouter.post("/email-exists", userController.emailExists);
authRouter.use("/me", authMiddleware, userController.currentUser);

export { authRouter };
