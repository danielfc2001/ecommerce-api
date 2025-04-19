import { Router } from "express";
import {
  getGlobalOfferProducts,
  getGlobalProducts,
} from "../controllers/gProducts.controller.js";

const router = Router();

router.get("/offers", getGlobalOfferProducts);
router.get("/", getGlobalProducts);

export default router;
