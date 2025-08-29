import express, { Router } from 'express';
const router = express.Router();
import { createDonation, getDonation } from '../controllers/donation.controllers.js';
import { authMiddleware } from '../middlewares/auth.middlewares.js';

router.post('/donation',authMiddleware, createDonation);

router.get('/donation', getDonation);

export default router;