import productModel from "../schemas/productModel.js";

export const getGlobalProducts = async (req, res) => {};

export const getGlobalOfferProducts = async (req, res) => {
  try {
    const products = await productModel.find({ isOffer: true });
    if (!products)
      throw {
        errorStatus: 404,
        message: "No se encontraron productos en oferta.",
      };
    res.status(200).json({ products });
  } catch (error) {
    res.status(error.errorStatus || 500).json({
      message: error.message || "A ocurrido un error al procesar la solicitud.",
    });
  }
};
