import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const AVATAR_COLORS=["#5B5CE2","#7C3AED","#10B981","#F59E0B","#3B82F6","#EF4444"];
function signToken(id){return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"7d"})}

export const register=asyncHandler(async(req,res)=>{
 const {name,email,password}=req.body;
 if(await User.findByEmail(email)) throw new AppError("An account with this email already exists.",409);
 const user=await User.create({name,email,password,avatarColor:AVATAR_COLORS[Math.floor(Math.random()*AVATAR_COLORS.length)]});
 res.status(201).json({success:true,token:signToken(user._id),user});
});
export const login=asyncHandler(async(req,res)=>{
 const {email,password}=req.body; const user=await User.findByEmail(email,true);
 if(!user || !(await User.comparePassword(user,password))) throw new AppError("Invalid email or password.",401);
 delete user.password; res.json({success:true,token:signToken(user._id),user});
});
export const me=asyncHandler(async(req,res)=>res.json({success:true,user:req.user}));
export const logout=asyncHandler(async(req,res)=>res.json({success:true,message:"Logged out."}));
