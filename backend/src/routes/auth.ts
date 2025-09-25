import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.ts";
import { sessionStatusController } from "../controllers/sessionStatusController.ts";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.ts";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/status", verifyToken, sessionStatusController);

export default router;
