import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";
import connectDB from "./db/mongodb.js";
import gProductsRoutes from "./routes/gProducts.routes.js";
/* import cron from "node-cron";
import { scrapeAndStoreValue } from "./libs/scraping.js";
import scrapedValueRoutes from "./routes/scrapedValue.routes.js"; */

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["https://commerce-ahb.pages.dev", "http://localhost:5173"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

connectDB();

app.use("/api/auth", authRoutes);

app.use("/api/gproducts", gProductsRoutes);

app.use("/api/products", upload.single("image"), productsRoutes);

/* app.use("/api/scraped-values", scrapedValueRoutes); */

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Programa la tarea para ejecutarse todos los días a las 3:00 AM
/* cron.schedule("0 3 * * *", async () => {
  console.log("Ejecutando tarea programada: Web Scraping");
  await scrapeAndStoreValue();
}); */

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port: ${process.env.PORT || 3000}`);
});
