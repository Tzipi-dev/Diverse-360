import express, { Router } from "express";
import { handleGetLinkPreview } from "../controllers/LinkPreviewController";

const router: Router = express.Router();

router.get("/", handleGetLinkPreview);

export default router;
