import express from "express";
import { getTodaysValue } from "../controllers/scrapedValue.controller.js";

const router = express.Router();

router.get("/today", getTodaysValue);

export default router;
