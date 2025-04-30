import puppeteer from "puppeteer";
import scrapedValueModel from "../schemas/scrapedValueModel.js";

export const scrapeAndStoreValue = async () => {
  try {
    // Inicia el navegador de Puppeteer
    const browser = await puppeteer.launch({
      headless: true, // Ejecuta el navegador en modo visible
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Navega al sitio web
    await page.goto("https://eltoque.com", { waitUntil: "networkidle2" });

    const value = await page.evaluate(() => {
      const querys = document.querySelectorAll("span.price-text");
      const data = querys[1].textContent.slice(0, 3).trim();
      return data;
    });

    console.log(value);

    await browser.close();

    // Almacena el valor en la base de datos
    if (!value) throw new Error("No se pudo extraer el valor del sitio web.");

    const scrapedValue = new scrapedValueModel({ value });
    await scrapedValue.save();

    console.log("Valor almacenado con éxito:", scrapedValue);
    return value;
  } catch (error) {
    console.error("Error al realizar el scraping:", error.message);
  }
};
