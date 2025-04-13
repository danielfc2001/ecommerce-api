import supertest from "supertest";
import app from "../index.js";
import Product from "../models/product.model.js";

const api = supertest(app);
