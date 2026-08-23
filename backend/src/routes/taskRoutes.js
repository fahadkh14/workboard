import { Router } from "express";
import { body } from "express-validator";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  updateTaskPriority,
  deleteTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();
router.use(protect);

router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", [body("title").trim().notEmpty().withMessage("Task title is required.")], validate, createTask);
router.put("/:id", updateTask);
router.patch("/:id/status", [body("status").isIn(["todo", "in_progress", "completed", "blocked"])], validate, updateTaskStatus);
router.patch("/:id/priority", [body("priority").isIn(["low", "medium", "high"])], validate, updateTaskPriority);
router.delete("/:id", deleteTask);

export default router;
