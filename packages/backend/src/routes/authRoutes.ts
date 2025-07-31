import { Router } from "express";
import { authController } from "../controllers/AuthController";

const router: Router = Router();

router.post("/login", authController.login);
router.post("/google", authController.googleLogin);
router.post("/github", authController.githubLogin);
router.post("/forgot-password", authController.forgotPassword);

export default router; 