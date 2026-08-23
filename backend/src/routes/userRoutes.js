import { Router } from "express";
import { getTeam, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.get("/team", getTeam);
router.put("/profile", updateProfile);

export default router;
