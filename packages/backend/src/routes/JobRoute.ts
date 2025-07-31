import express, { Router } from 'express';
import { JobController } from '../controllers/JobController';

const router: Router = express.Router();
const jobController = new JobController();

router.post('/', jobController.createJob.bind(jobController));
router.get('/', jobController.getAllJobs.bind(jobController));

router.get('/filter', jobController.getFilterJobs.bind(jobController))

router.get('/',jobController.getJobsWithPagination.bind(jobController))

router.get('/:id', jobController.getJobById.bind(jobController));
router.put('/:id', jobController.updateJob.bind(jobController));
router.delete('/:id', jobController.deleteJob.bind(jobController));
router.get('/:id/matching-candidates', jobController.getMatchingCandidates.bind(jobController));

export default router;
