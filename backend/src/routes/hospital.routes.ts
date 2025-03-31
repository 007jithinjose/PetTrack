//File: src/routes/hospital.routes.ts
import express from 'express';
import { validate } from '../middlewares/validate';
import { hospitalValidation } from '../validations/hospital.validation';
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
 * /hospitals:
 *   post:
 *     summary: Create a new hospital
 *     tags: [Hospitals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HospitalInput'
 *           example:
 *             $ref: '#/components/examples/HospitalRequest'
 *     responses:
 *       201:
 *         description: Hospital created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *             example:
 *               $ref: '#/components/examples/HospitalResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               $ref: '#/components/examples/HospitalError'
 *   get:
 *     summary: Get all hospitals with pagination
 *     tags: [Hospitals]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Limit number of hospitals per page
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
 *                 results:
 *                   type: integer
 *                   description: Number of results on the current page.
 *                 page:
 *                   type: integer
 *                   description: Current page number.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hospital'
 *             example:
 *               results: 2
 *               page: 1
 *               data:
 *                 - $ref: '#/components/examples/HospitalResponse'
 *                 - name: "Another Hospital"
 *                   address:
 *                     street: "789 Health St"
 *                     city: "Boston"
 *                     state: "MA"
 *                     zipCode: "02115"
 *                     country: "USA"
 *                   contactNumber: "617-555-1234"
 *                   email: "info@anotherhospital.com"
 *                   services: ["Pediatrics", "Surgery"]
 */
router.route('/')
  .post(validate(hospitalValidation.createHospital), createHospital)
  .get(getHospitals);

/**
 * @swagger
 * /hospitals/list-for-registration:
 *   get:
 *     summary: Get a simplified list of hospitals for doctor registration
 *     tags: [Hospitals]
 *     responses:
 *       200:
 *         description: A list of hospital IDs and names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HospitalForDoctorRegistration'
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 name: "City Veterinary Hospital"
 *               - _id: "507f1f77bcf86cd799439012"
 *                 name: "Metropolitan Animal Hospital"
 */
router.get('/list-for-registration', getHospitalsForRegistration);

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
 *         description: Hospital ID
 *     responses:
 *       200:
 *         description: Hospital data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *             example:
 *               $ref: '#/components/examples/HospitalResponse'
 *       404:
 *         description: Hospital not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hospital not found"
 *   patch:
 *     summary: Update hospital
 *     tags: [Hospitals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hospital ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hospital'
 *           example:
 *             name: "Updated Hospital Name"
 *             services: ["New Service 1", "New Service 2"]
 *     responses:
 *       200:
 *         description: Updated hospital data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hospital'
 *       400:
 *         description: Validation error
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
 *         description: Hospital ID
 *     responses:
 *       204:
 *         description: Hospital deleted successfully
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
 *         description: Hospital ID
 *     responses:
 *       200:
 *         description: List of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DoctorReference'
 *             example:
 *               - _id: "507f1f77bcf86cd799439012"
 *                 name: "Dr. Sarah Johnson"
 *                 email: "s.johnson@hospital.com"
 *                 specialization: "Cardiology"
 *               - _id: "507f1f77bcf86cd799439013"
 *                 name: "Dr. Michael Chen"
 *                 email: "m.chen@hospital.com"
 *                 specialization: "Neurology"
 *       404:
 *         description: Hospital not found
 */
router.route('/:id/doctors')
  .get(getHospitalDoctors);

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
 *         description: Hospital ID
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: Doctor added successfully
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
 *         description: Hospital ID
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: Doctor removed successfully
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