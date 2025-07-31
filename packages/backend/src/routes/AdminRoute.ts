import { Router } from "express";
import { authController } from "../controllers/AuthController";

const router: Router = Router();

router.post("/login", authController.login);

export default router; 