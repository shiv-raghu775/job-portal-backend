import express from 'express';
import {postJob, getAllJobs, getJobById, getAdminJobs} from '../controllers/job.controller.js';
import  isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.route('/post').post(isAuthenticated, postJob);
router.route('/getAll').get(getAllJobs);
router.route('/getById/:id').get(getJobById);
router.route('/getAdminJobs').get(isAuthenticated, getAdminJobs);

export default router;