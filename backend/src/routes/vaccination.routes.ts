//File: src/routes/vaccination.routes.ts
import express from 'express';
import { protect } from '../middlewares/auth';
import {
  addVaccination,
  getPetVaccinations,
  getUpcomingVaccinations
} from '../controllers/vaccination.controller';

const router = express.Router();

router.use(protect);

router.route('/pets/:petId/vaccinations')
  .post(addVaccination)
  .get(getPetVaccinations);

router.get('/upcoming', getUpcomingVaccinations);

export default router;