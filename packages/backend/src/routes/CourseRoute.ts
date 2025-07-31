import { Router } from "express";
import { CourseController, generateCourseImage } from "../controllers/CourseController";
import multer from "multer";

const courseRouter: Router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const courseController = new CourseController();

courseRouter.get('/', courseController.getAllCourses);
courseRouter.get('/subject/:subject', courseController.getCoursesBySubject);
courseRouter.get('/lecturer/:lecturer', courseController.getCoursesByLecturer);
courseRouter.get('/:title', courseController.getCourseBtTitle);
courseRouter.put('/:id', upload.single('video'), courseController.updateCourseController);
courseRouter.post('/', upload.single('video'), courseController.CreateCourse);
courseRouter.delete('/:id', courseController.DeleteCourse);
courseRouter.post("/generate-image", generateCourseImage);
export default courseRouter;
