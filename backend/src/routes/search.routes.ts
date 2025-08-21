//File:src/routes/search.routes.ts
import express from 'express';
import { searchDoctors, searchHospitals } from '../controllers/search.controller';

const router = express.Router();

router.get('/doctors', searchDoctors);
router.get('/hospitals', searchHospitals);

export default router;