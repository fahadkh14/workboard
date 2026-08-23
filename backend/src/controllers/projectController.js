import Project from "../models/Project.js";
import Task from "../models/Task.js";
import {AppError} from "../utils/AppError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
export const getProjects=asyncHandler(async(req,res)=>{
 const projects=await Project.findVisible(req.user._id);
 const withStats=await Promise.all(projects.map(async p=>{const taskCount=await Task.countWhere("projectId=?",[p._id]);const completedCount=await Task.countWhere("projectId=? AND status='completed'",[p._id]);return {...p,taskCount,completedCount,progress:taskCount?Math.round(completedCount/taskCount*100):0}}));
 res.json({success:true,projects:withStats});
});
export const getProject=asyncHandler(async(req,res)=>{const p=await Project.findById(req.params.id);if(!p)throw new AppError("Project not found.",404);const taskCount=await Task.countWhere("projectId=?",[p._id]);const completedCount=await Task.countWhere("projectId=? AND status='completed'",[p._id]);res.json({success:true,project:{...p,taskCount,completedCount,progress:taskCount?Math.round(completedCount/taskCount*100):0}})});
export const createProject=asyncHandler(async(req,res)=>{const {name,description,color,dueDate,status}=req.body;const project=await Project.create({name,description,color,dueDate,status,owner:req.user._id});res.status(201).json({success:true,project})});
export const updateProject=asyncHandler(async(req,res)=>{const p=await Project.update(req.params.id,req.body);if(!p)throw new AppError("Project not found.",404);res.json({success:true,project:p})});
export const deleteProject=asyncHandler(async(req,res)=>{if(!await Project.delete(req.params.id))throw new AppError("Project not found.",404);res.json({success:true,message:"Project deleted."})});
