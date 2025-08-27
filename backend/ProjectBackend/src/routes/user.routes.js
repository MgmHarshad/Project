import express from 'express'
const router = express.Router();
import { registerUser, getUserProfile } from '../controllers/user.controllers.js';
import {loginUsers} from '../controllers/login.controllers.js';
import { logoutUser } from '../controllers/logout.controllers.js';

router.post('/users', registerUser);

router.post('/login', loginUsers);

router.post('/logout', logoutUser);

router.get('/user', getUserProfile);

export default router;