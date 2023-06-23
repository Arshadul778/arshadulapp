import express from  'express';
import {registerController,
    loginController,
    testController,
    forgotPasswordController
} from "../controllers/authController.js";

import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

//route obj
const router = express.Router();

//routing
//register
router.post('/register',registerController)

//login ||post
router.post('/login',loginController)

//Forgot password ||post
router.post('/forgot-password', forgotPasswordController);

//test route
router.get('/test', requireSignIn,isAdmin, testController);

//protected route auth
router.get('/user-auth',requireSignIn,(req,res) => {
    res.status(200).send({ok:true});
});

//protected route auth for admin 
router.get('/admin-auth',requireSignIn,isAdmin,(req,res) => {
    res.status(200).send({ok:true});
});

export default router;