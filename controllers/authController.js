import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController=async(req,res) => {
    try {
        const {name,email,password,phone,address,question} = req.body
        // valiadation
        if (!name){
            return res.send({message:'Name is require'})
        }
        if (!email){
            return res.send({message:'email is require'})
        }
        if (!address){
            return res.send({message:'address is require'})
        }
        if (!password){
            return res.send({message:'passwor is require'})
        }
        if (!phone){
            return res.send({message:'phone is require'})
        }
        if (!question){
            return res.send({message:'answer is require'})
        }
        // check user
        const exisitingUser =await userModel.findOne({email})
        // existing user
        if(exisitingUser){
            return res.status(200).send({
                success:false,
                message:"Already resistered please login",
            })
        }
        //resister user
        const hashedPassword = await hashPassword(password)
        //save
        const user =await new userModel({name,email,phone,address,question,password:hashedPassword}).save();

        res.status(201).send({
            success:true,
            message:"User Register successfully",
            user,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in registeration',
            error
        })
    }
};






//post login
export const loginController=async(req,res)=>{
    try {
        const {email,password} = req.body
        //validation
        if (!email || !password){
            return res.status(404).send({
                success:false,
                message: 'Invalid email / Password'
            })
        }
        // check user
        const user =await userModel.findOne({email})
        if (!user){
            return res.status(404).send({
                success:false,
                message:"Email is not Registered"
            })
        }
        const match =await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:"Invalid Password"
            })
        }
        //token
        const token = await JWT.sign({_id: user._id},process.env.JWT_SECRET,{
            expiresIn:"7d",
        });
        res.status(200).send({
            success:true,
            message:"Login Successfully",
            user :{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,
            },
            token,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in login",
            error,
        });
    }
};

//forgotPasswordController

export const forgotPasswordController = async(req,res)=> {
    try {
        const {email,question,newPassword} = req.body
        if (!email) {
            res.status(400).send({message:"Question is reqired"})
        }
        if (!question) {
            res.status(400).send({message:"Email is reqired"})
        }
        if (!newPassword) {
            res.status(400).send({message:"New password is reqired"})
        }
        // check
        const user = await userModel.findOne({email,question});
        //validation
        if (!user) {
            return res.status(404).send({
                success:false,
                message:"Wrong Email or Question"
            });
        }
        const hashed = await hashPassword (newPassword);
        await userModel.findByIdAndUpdate(user._id, {password:hashed});
        res.status(200).send({
            success:true,
            message:"Password Reset Successfully",
        });

    } catch (error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            error
        });
    }
};

//test controller
export const testController= (req,res) => {
   try {
     res.send('protected route');
    } catch (error) {
        console.log(error);
        res.send({error});
    }
};
