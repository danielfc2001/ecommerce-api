import express from "express";
import {
  createProduct,
  getUserProducts,
} from "../controllers/products.controller.js";
import { verifyAccount } from "../middlewares/verifyAccount.js";
import { productValidation } from "../middlewares/productValidation.js";

const router = express.Router();

// SE MOVIERON LAS RUTAS QUE REFIEREN A RECUPERACION DE DATOS EN UN CONTEXTO GLOBAL PARA EVITAR FALLAS A LA HORA DE MANEJAR LOS ERRORES

router.get("/user", verifyAccount, getUserProducts);

router.post("/create", productValidation, verifyAccount, createProduct);

export default router;
