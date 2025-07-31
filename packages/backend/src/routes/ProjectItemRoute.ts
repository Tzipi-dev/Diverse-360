import express, { Router } from 'express';
import multer from 'multer';
import {
  getAllProjects,
  deleteProject,
  createProject,
  updateProject,
} from '../controllers/ProjectItemController';

const router: Router = Router();
const upload = multer();

router.get('/getAll', getAllProjects);
router.post('/', upload.single('imageFile'), createProject);
router.put('/:id', upload.single('imageFile'), updateProject);
router.delete('/:id', deleteProject);

export default router;

