// File: src/routes/pet.routes.ts
import express from 'express';
import { auth } from '../middlewares/auth';
import { petValidation } from '../validations/pet.validation';
import { validate } from '../middlewares/validate';
import * as PetController from '../controllers/pet.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: Pet management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Pet:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - breed
 *         - age
 *         - weight
 *       properties:
 *         name:
 *           type: string
 *           example: "Buddy"
 *         type:
 *           type: string
 *           enum: [dog, cat, bird, other]
 *           example: "dog"
 *         breed:
 *           type: string
 *           example: "Golden Retriever"
 *         age:
 *           type: number
 *           minimum: 0
 *           example: 3
 *         weight:
 *           type: number
 *           minimum: 0.1
 *           example: 25.5
 *         vaccinations:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           example: ["507f1f77bcf86cd799439011"]
 *         medicalRecords:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           example: ["507f1f77bcf86cd799439012"]
 */

/**
 * @swagger
 * /api/v1/pets:
 *   post:
 *     summary: Create a new pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       201:
 *         description: Pet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Bad request - invalid input data
 *       401:
 *         description: Unauthorized - missing or invalid token
 */
router.post(
  '/',
  auth('petOwner'),
  validate(petValidation.createPet),
  PetController.createPet
);

/**
 * @swagger
 * /api/v1/pets:
 *   get:
 *     summary: Get all pets for the current user
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       401:
 *         description: Unauthorized - missing or invalid token
 */
router.get(
  '/',
  auth('petOwner'),
  PetController.getPets
);

/**
 * @swagger
 * /api/v1/pets/{petId}:
 *   get:
 *     summary: Get a specific pet by ID
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB ID of the pet
 *     responses:
 *       200:
 *         description: Pet data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: Pet not found
 */
router.get(
  '/:petId',
  auth('petOwner'),
  PetController.getPet
);

/**
 * @swagger
 * /api/v1/pets/{petId}:
 *   patch:
 *     summary: Update a pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB ID of the pet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pet'
 *     responses:
 *       200:
 *         description: Updated pet data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Bad request - invalid input data
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: Pet not found
 */
router.patch(
  '/:petId',
  auth('petOwner'),
  validate(petValidation.updatePet),
  PetController.updatePet
);

/**
 * @swagger
 * /api/v1/pets/{petId}:
 *   delete:
 *     summary: Delete a pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         schema:
 *           type: string
 *         required: true
 *         description: MongoDB ID of the pet
 *     responses:
 *       204:
 *         description: Pet deleted successfully
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: Pet not found
 */
router.delete(
  '/:petId',
  auth('petOwner'),
  PetController.deletePet
);

export default router;