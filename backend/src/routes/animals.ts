import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.ts";
import { getAllAnimals, getAnimalById, uploadAnimal, updateAnimal, deleteAnimal } from "../controllers/animalsController.ts";

const router = Router();

router.get("/", verifyToken, getAllAnimals);
router.get("/:id", verifyToken, getAnimalById);
router.post("/", verifyToken, uploadAnimal);
router.put("/:id", verifyToken, updateAnimal);
router.delete("/:id", verifyToken, deleteAnimal);

export default router;
