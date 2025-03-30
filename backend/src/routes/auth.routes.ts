// File: src/routes/auth.routes.ts
import express from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { authValidation } from '../validations/auth.validation';
import { rateLimiter } from '../middlewares/rateLimiter';

const router = express.Router();

// Apply rate limiting to auth endpoints
router.use(rateLimiter);

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and registration
 */

/**
 * @swagger
 * /api/v1/auth/register/pet-owner:
 *   post:
 *     summary: Register a new pet owner
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PetOwnerRegistration'
 *     responses:
 *       201:
 *         description: Pet owner registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request
 *       409:
 *         description: Email already exists
 */
router.post(
  '/register/pet-owner',
  validate(authValidation.registerPetOwner),
  authController.registerPetOwner
);

/**
 * @swagger
 * /api/v1/auth/register/doctor:
 *   post:
 *     summary: Register a new doctor
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DoctorRegistration'
 *     responses:
 *       201:
 *         description: Doctor registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request
 *       409:
 *         description: Email already exists
 */
router.post(
  '/register/doctor',
  validate(authValidation.registerDoctor),
  authController.registerDoctor
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginCredentials'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid credentials
 */
router.post(
  '/login',
  validate(authValidation.login),
  authController.login
);

export default router;