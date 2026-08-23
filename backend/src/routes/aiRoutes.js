import { Router } from "express";
import { body } from "express-validator";
import { chat } from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();
router.use(protect);

router.post("/chat", [body("message").trim().notEmpty()], validate, chat);

export default router;
