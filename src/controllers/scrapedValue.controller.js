import ScrapedValue from "../schemas/scrapedValueModel.js";

export const getTodaysValue = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Establece la hora al inicio del día

    const value = await ScrapedValue.findOne({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (!value) {
      return res
        .status(404)
        .json({ message: "No se encontró un valor para el día de hoy." });
    }

    res.status(200).json({ value });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener el valor del día.",
        error: error.message,
      });
  }
};
