import { Router } from "express";
import { saveData, getData } from "../controllers/example.controller";

const router = Router();

router.post("/save", saveData);
router.get("/list", getData);

export default router;
