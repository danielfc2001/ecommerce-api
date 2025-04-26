import { Router } from "express";
import {
  getGlobalOfferProducts,
  getGlobalProducts,
} from "../controllers/gProducts.controller.js";

const router = Router();

router.get("/", getGlobalProducts);
router.get("/offers", getGlobalOfferProducts);

export default router;
