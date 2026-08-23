import { Router } from "express";
import { body } from "express-validator";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();
router.use(protect);

router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", [body("name").trim().notEmpty().withMessage("Project name is required.")], validate, createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
