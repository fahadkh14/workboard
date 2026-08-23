import Notification from "../models/Notification.js";import {AppError} from "../utils/AppError.js";import {asyncHandler} from "../utils/asyncHandler.js";
export const getNotifications=asyncHandler(async(req,res)=>res.json({success:true,notifications:await Notification.findForUser(req.user._id),unreadCount:await Notification.unreadCount(req.user._id)}));
export const markRead=asyncHandler(async(req,res)=>{const n=await Notification.markRead(req.params.id,req.user._id);if(!n)throw new AppError("Notification not found.",404);res.json({success:true,notification:n})});
export const markAllRead=asyncHandler(async(req,res)=>{await Notification.markAllRead(req.user._id);res.json({success:true,message:"All notifications marked as read."})});
