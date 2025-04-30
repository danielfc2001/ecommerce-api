import productModel from "../schemas/productModel.js";

export const getGlobalProducts = async (req, res) => {
  const { page, category } = req.query;
  try {
    if (!page)
      throw {
        errorStatus: 500,
        message: "Debe enviar el numero de pagina para procesar la solicitud.",
      };
    const products = await productModel
      .find(category === "all" ? {} : { category })
      .limit(10)
      .skip((page - 1) * 10);
    if (!products)
      throw {
        errorStatus: 404,
        message: "No se han encontrado productos que mostrar.",
      };
    const totalProducts = await productModel.countDocuments(
      category === "all" ? {} : { category }
    );
    const totalPages = Math.ceil(totalProducts / 10);
    const result = {
      products,
      totalProducts,
      totalPages,
      currentPage: parseInt(page),
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? parseInt(page) + 1 : null,
      prevPage: page > 1 ? parseInt(page) - 1 : null,
      isLastPage: page >= totalPages,
      activeFilters: {
        category,
      },
    };
    console.log(result);
    res.status(200).json({
      ...result,
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
  const { category } = req.query;
  try {
    const products = await productModel
      .find(
        category === "all" ? { isOffer: true } : { isOffer: true, category }
      )
      .sort({ field: "desc" })
      .limit(12);
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
