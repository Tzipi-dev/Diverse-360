import { Router } from "express";
import { VideoController } from "../controllers/VideoController";
import multer from "multer";

const videoRouter: Router = Router();
const videoController = new VideoController();
const storage = multer.memoryStorage();
const upload = multer({ storage });


videoRouter.get('/by-course/:course_id', videoController.getVideosByCourseId);
videoRouter.post('/', upload.single('video'), videoController.createVideo);
videoRouter.put('/:id',upload.single('video'), videoController.updateVideo);
videoRouter.delete('/:id', videoController.deleteVideo);

export default videoRouter;