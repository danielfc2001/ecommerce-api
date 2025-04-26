import puppeteer from "puppeteer";
/* import ScrapedValue from "../schemas/scrapedValueModel.js"; */

export const scrapeAndStoreValue = async () => {
  try {
    // Inicia el navegador de Puppeteer
    const browser = await puppeteer.launch({
      headless: true, // Ejecuta el navegador en modo visible
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Navega al sitio web
    await page.goto("https://eltoque.com");

    // Espera a que el contenedor específico esté disponible en el DOM
    await page.waitForSelector(".price-text"); // Cambia '.specific-container-class' por el selector real

    // Extrae el texto del contenedor
    const value = await page.$eval(".price-text", (el) => {
      console.log(el);
      el.textContent.trim();
    });

    // Cierra el navegador
    await browser.close();

    console.log(value);
    return;
    /*     // Almacena el valor en la base de datos
    const scrapedValue = new ScrapedValue({ value });
    await scrapedValue.save();
    
    console.log("Valor almacenado con éxito:", scrapedValue); */
  } catch (error) {
    console.error("Error al realizar el scraping:", error.message);
  }
};

scrapeAndStoreValue();

// Función para extraer el valor del HTML (ajusta según el sitio web)
/* const extractValueFromHTML = (html) => {
  // Implementa la lógica para extraer el valor del HTML
  // Por ejemplo, puedes usar expresiones regulares o una librería como cheerio
  return "valor-ejemplo"; // Reemplaza con el valor extraído
}; */
