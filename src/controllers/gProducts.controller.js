import productModel from "../schemas/productModel.js";

export const getGlobalProducts = async (req, res) => {
  const { page } = req.query;
  console.log(page);
  try {
    if (!page)
      throw {
        errorStatus: 500,
        message: "Debe enviar el numero de pagina para procesar la solicitud.",
      };
    const products = await productModel
      .find({})
      .limit(10)
      .skip((page - 1) * 10);
    if (!products)
      throw {
        errorStatus: 404,
        message: "No se han encontrado productos que mostrar.",
      };
    const totalProducts = await productModel.countDocuments({});
    const totalPages = Math.ceil(totalProducts / 10);
    res.status(200).json({
      products,
      totalProducts,
      totalPages,
      currentPage: parseInt(page),
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? parseInt(page) + 1 : null,
      prevPage: page > 1 ? parseInt(page) - 1 : null,
      isLastPage: page >= totalPages,
    });
  } catch (error) {
    console.log(error);
    return res.status(error.errorStatus || 500).json({
      message:
        error.message ||
        "A ocurrido un error al procesar la solicitud del cliente.",
    });
  }
};

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
