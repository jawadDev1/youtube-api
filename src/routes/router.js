import { Router } from "express";
const router = Router();

// Route Imports
import userRouter from './user.routes.js'

// Routes Declaration

router.use('/users', userRouter)

export default router