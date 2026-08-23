import { Router } from "express";
import { getOverview, getProductivityTrend } from "../controllers/analyticsController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.get("/overview", getOverview);
router.get("/productivity", getProductivityTrend);

export default router;
