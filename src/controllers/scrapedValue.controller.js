import { scrapeAndStoreValue } from "../libs/scraping.js";
import ScrapedValue from "../schemas/scrapedValueModel.js";

export const getTodaysValue = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Establece la hora al inicio del día

    const storedValue = await ScrapedValue.findOne({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });
    if (!storedValue) {
      console.log("Usando la funcion directamente para almacenar el dato.");
      const value = await scrapeAndStoreValue();
      if (!value) {
        return res
          .status(500)
          .json({ message: "Error en la devolucion del valor para el dia." });
      }
      return res.status(200).json({ value });
    }
    return res.status(200).json({ value: storedValue.value });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el valor del día.",
      error: error.message,
    });
  }
};
