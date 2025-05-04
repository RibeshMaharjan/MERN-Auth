import express from "express";
import {login, logout, signup, verifyEmail, forgotPassword, resetPassword, checkAuth} from "../controllers/auth.controller.js";
import {verifyToken} from "../middleware/verifyToken.js";

const router = express.Router();

router.get('/checkAuth', verifyToken, checkAuth);

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.post('/verifyEmail', verifyEmail);
router.post('/forgotPassword', forgotPassword);
router.post('/password-reset/:token', resetPassword);

export default router;