import express from "express";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  getUserProducts,
} from "../controllers/products.controller.js";
import { verifyAccount } from "../middlewares/verifyAccount.js";
import { productValidation } from "../middlewares/productValidation.js";

const router = express.Router();

router.get("/", verifyAccount, getAllProducts);

router.get("/:id", verifyAccount, getSingleProduct);

router.get("/user", verifyAccount, getUserProducts);

router.post("/create", productValidation, verifyAccount, createProduct);

export default router;
