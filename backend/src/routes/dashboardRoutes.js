import { Router } from "express";
import { getSummary, getProductivity, getRecent } from "../controllers/dashboardController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.get("/summary", getSummary);
router.get("/productivity", getProductivity);
router.get("/recent", getRecent);

export default router;
