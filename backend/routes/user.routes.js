import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import upload from '../middlewares/multer.js';
import { askToAssistant, getCurrentUser, updateUser } from '../controllers/user.controllers.js';

const userRouter = express.Router();

userRouter.get('/current', isAuth, getCurrentUser);
userRouter.put('/update', isAuth, upload.single('assistantImage'), updateUser);
userRouter.post('/ask', isAuth, askToAssistant);

export default userRouter;
//userRouter.put k jgh post krenge kya check krna hai baad m