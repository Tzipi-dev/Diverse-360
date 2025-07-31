import { Request, Response } from "express";
import { getLinkPreview } from "../services/linkPreviewService";

export async function handleGetLinkPreview(req: Request, res: Response) {
  const { url } = req.query;
  if (!url || typeof url !== "string") return res.status(400).send("Missing url");

  try {
    const preview = await getLinkPreview(url);
    if (preview) {
      res.json(preview);
    } else {
      res.status(500).send("Failed to fetch preview");
    }
  } catch (error) {
    console.error("Error in link preview:", error);
    res.status(500).send("Internal server error");
  }
}
