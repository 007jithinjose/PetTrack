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
 * components:
 *   schemas:
 *     LoginCredentials:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: Password123!
 * 
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           description: JWT access token
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * 
 *     PetOwnerRegistration:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *         - phone
 *         - address
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: owner@example.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"
 *           example: SecurePassword123
 *         firstName:
 *           type: string
 *           minLength: 2
 *           example: John
 *         lastName:
 *           type: string
 *           minLength: 2
 *           example: Doe
 *         phone:
 *           type: string
 *           minLength: 10
 *           example: "+1234567890"
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *               example: "123 Main St"
 *             city:
 *               type: string
 *               example: "New York"
 *             state:
 *               type: string
 *               example: "NY"
 *             zipCode:
 *               type: string
 *               example: "10001"
 *             country:
 *               type: string
 *               example: "USA"
 * 
 *     DoctorRegistration:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *         - specialization
 *         - contactNumber
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: doctor@example.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *           pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$"
 *           example: DoctorPass123
 *         name:
 *           type: string
 *           minLength: 2
 *           example: "Dr. Smith"
 *         specialization:
 *           type: string
 *           minLength: 2
 *           example: "Veterinary Surgery"
 *         hospital:
 *           type: string
 *           description: Hospital ID
 *           example: "507f1f77bcf86cd799439013"
 *         contactNumber:
 *           type: string
 *           minLength: 10
 *           example: "+1234567890"
 */

/**
 * @swagger
 * /auth/register/pet-owner:
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
 *         headers:
 *           Authorization:
 *             schema:
 *               type: string
 *             description: JWT access token
 *       400:
 *         description: Bad request - Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: string
 *                         example: "body.email"
 *                       message:
 *                         type: string
 *                         example: "Invalid email format"
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email already in use"
 */
router.post(
  '/register/pet-owner',
  validate(authValidation.registerPetOwner),
  authController.registerPetOwner
);

/**
 * @swagger
 * /auth/register/doctor:
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
 *         headers:
 *           Authorization:
 *             schema:
 *               type: string
 *             description: JWT access token
 *       400:
 *         description: Bad request - Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email already in use"
 */
router.post(
  '/register/doctor',
  validate(authValidation.registerDoctor),
  authController.registerDoctor
);

/**
 * @swagger
 * /auth/login:
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
 *         headers:
 *           Authorization:
 *             schema:
 *               type: string
 *             description: JWT access token
 *       400:
 *         description: Bad request - Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password"
 */
router.post(
  '/login',
  validate(authValidation.login),
  authController.login
);


export default router;