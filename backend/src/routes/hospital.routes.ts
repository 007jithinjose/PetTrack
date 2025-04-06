//File: src/routes/hospital.routes.ts
import express from 'express';
import { validate } from '../middlewares/validate';
import { hospitalValidation } from '../validations/hospital.validation';
import { validateObjectId } from '../middlewares/validateObjectId';
import {
  createHospital,
  getHospitals,
  getHospital,
  updateHospital,
  deleteHospital,
  getHospitalDoctors,
  addHospitalDoctor,
  removeHospitalDoctor,
  getHospitalsForRegistration
} from '../controllers/hospital.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Hospitals
 *     description: Hospital management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Hospital:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - contactNumber
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the hospital
 *           example: 507f1f77bcf86cd799439011
 *         name:
 *           type: string
 *           description: The name of the hospital
 *           example: City Veterinary Hospital
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             zipCode:
 *               type: string
 *             country:
 *               type: string
 *         contactNumber:
 *           type: string
 *           description: The contact number of the hospital
 *           example: 617-555-1234
 *         email:
 *           type: string
 *           format: email
 *         services:
 *           type: array
 *           items:
 *             type: string
 *         doctors:
 *           type: array
 *           items:
 *             type: string
 *             description: References to Doctor documents
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     HospitalForRegistration:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The hospital ID
 *           example: 507f1f77bcf86cd799439011
 *         name:
 *           type: string
 *           description: The hospital name
 *           example: City Veterinary Hospital
 */

/**
 * @swagger
 * /hospitals:
 *   post:
 *     summary: Create a new hospital
 *     tags: [Hospitals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hospital'
 *     responses:
 *       201:
 *         description: Hospital created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *       400:
 *         description: Validation error
 *   get:
 *     summary: Get all hospitals with pagination
 *     tags: [Hospitals]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Limit number of hospitals
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of hospitals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 results:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hospital'
 */
router.route('/')
  .post(validate(hospitalValidation.createHospital), createHospital)
  .get(getHospitals);

/**
 * @swagger
 * /hospitals/list-for-registration:
 *   get:
 *     summary: Get simplified hospital list for registration
 *     tags: [Hospitals]
 *     responses:
 *       200:
 *         description: List of hospitals (id and name only)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HospitalForRegistration'
 */
router.get('/list-for-registration', getHospitalsForRegistration);

// Apply ID validation to all routes below this point
router.use('/:id', validateObjectId('id'));

/**
 * @swagger
 * /hospitals/{id}:
 *   get:
 *     summary: Get hospital by ID
 *     tags: [Hospitals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     responses:
 *       200:
 *         description: Hospital data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *       404:
 *         description: Hospital not found
 *   patch:
 *     summary: Update hospital
 *     tags: [Hospitals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hospital'
 *     responses:
 *       200:
 *         description: Updated hospital
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *       404:
 *         description: Hospital not found
 *   delete:
 *     summary: Delete hospital
 *     tags: [Hospitals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Hospital deleted
 *       404:
 *         description: Hospital not found
 */
router.route('/:id')
  .get(getHospital)
  .patch(validate(hospitalValidation.updateHospital), updateHospital)
  .delete(deleteHospital);

/**
 * @swagger
 * /hospitals/{id}/doctors:
 *   get:
 *     summary: Get all doctors for a hospital
 *     tags: [Hospitals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DoctorReference'
 *       404:
 *         description: Hospital not found
 */
router.route('/:id/doctors')
  .get(getHospitalDoctors);

// Apply double ID validation for doctor operations
router.use('/:id/doctors/:doctorId', (req, res, next) => {
  validateObjectId('id')(req, res, (err) => {
    if (err) return next(err);
    validateObjectId('doctorId')(req, res, next);
  });
});

/**
 * @swagger
 * /hospitals/{id}/doctors/{doctorId}:
 *   post:
 *     summary: Add doctor to hospital
 *     tags: [Hospitals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *       404:
 *         description: Hospital or doctor not found
 *   delete:
 *     summary: Remove doctor from hospital
 *     tags: [Hospitals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor removed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *       404:
 *         description: Hospital or doctor not found
 */
router.route('/:id/doctors/:doctorId')
  .post(addHospitalDoctor)
  .delete(removeHospitalDoctor);

export default router;