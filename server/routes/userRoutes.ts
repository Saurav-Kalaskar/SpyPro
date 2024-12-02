import { Router } from "express";
import { getUser, createUser } from "../controllers/userController";

const router = Router();

router.get("/:id", getUser);
router.post("/", createUser);

export default router;
