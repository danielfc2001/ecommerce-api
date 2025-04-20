import { cloudImgRemove } from "../libs/cloudImgRemove.js";
import { cloudImgUpload } from "../libs/cloudImgUpload.js";
import productModel from "../schemas/productModel.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    if (!products)
      throw {
        errorStatus: 404,
        message: "No se encontraron productos.",
      };
    res.status(200).json({ products });
  } catch (error) {
    res.status(error.errorStatus).json({ message: error.message });
  }
};

export const getUserProducts = async (req, res) => {
  const { id } = req.user;
  console.log(req.user);
  try {
    if (!id)
      throw {
        errorStatus: 500,
        message: "A ocurrido un error al recuperar los productos del usuario.",
      };
    const matches = await productModel.find({ createdBy: id });
    if (!matches)
      throw {
        errorStatus: 404,
        message: "A ocurrido un error al recuperar los productos del usuario.",
      };
    res.status(200).json({
      products: matches,
    });
  } catch (error) {
    console.log(error);
    res
      .status(error?.errorStatus || 500)
      .json({ message: error.message || "Error interno del servidor." });
  }
};

export const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const products = await productModel.findById(id);
    if (!products)
      throw {
        errorStatus: 404,
        message: "No se encontraron productos.",
      };
    res.status(200).json({ products });
  } catch (error) {
    res.status(error.errorStatus).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const product = {
    ...req.body,
  };
  console.log(product);

  try {
    if (
      !product.name ||
      !product.description ||
      !product.category ||
      !product.price ||
      !product.isOffer
    )
      throw {
        errorStatus: 400,
        message: "Debe rellenar todos los campos de tipo obligatorio.",
      };

    if (!product.image) {
      const model = new productModel({
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        currency: product.currency,
        alterCurrency:
          (product.currency === "USD") & (product.acceptCup === "true")
            ? true
            : false,
        stock: parseFloat(product.stock),
        category: product.category,
        isOffer: product.isOffer === "true" ? true : false,
        offerDiscount: product.offerDiscount
          ? parseFloat(product.offerDiscount)
          : 0,
        createdBy: product.id,
      });

      const newProduct = await model.save();
      if (!newProduct)
        throw { message: "A ocurrido un error al crear el producto." };
      console.log(model);
      return res
        .status(200)
        .json({ message: "El producto a sido creado satisfactoriamente." });
    }

    // En caso de que exista la imagen entonces se procesara por la nube de cloudinary
    const uploadImgResult = await cloudImgUpload(product.image);

    console.log(uploadImgResult);

    if (!uploadImgResult)
      throw {
        errorStatus: 500,
        message: "A ocurrido un error al procesar la imagen.",
      };
    const model = new productModel({
      name: product.name,
      description: product.description,
      image: uploadImgResult.secure_url,
      imageId: uploadImgResult.public_id,
      price: parseFloat(product.price),
      currency: product.currency,
      alterCurrency:
        (product.currency === "USD") & (product.acceptCup === "true")
          ? true
          : false,
      stock: parseFloat(product.stock),
      category: product.category,
      isOffer: product.isOffer === "true" ? true : false,
      offerDiscount: product.offerDiscount
        ? parseFloat(product.offerDiscount)
        : 0,
      createdBy: product.id,
    });

    const newProduct = await model.save();
    if (!newProduct)
      throw { message: "A ocurrido un error al crear el producto." };
    console.log(model);
    res
      .status(200)
      .json({ message: "El producto a sido creado satisfactoriamente." });
  } catch (err) {
    res.status(err.errorStatus || 500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const match = await productModel.findById(id);
    if (!match)
      throw {
        errorStatus: 404,
        message: "No se encontraron productos.",
      };

    if (!match.imageId)
      throw {
        errorStatus: 500,
        message: "A ocurrido un error al recuperar la imagen.",
      };
    const deletedImg = await cloudImgRemove(match.imageId);
    if (!deletedImg) {
      throw {
        errorStatus: 500,
        message: "A ocurrido un error al eliminar la imagen.",
      };
    }
    const product = await productModel.findByIdAndDelete(id);
    if (!product)
      throw {
        errorStatus: 404,
        message: "No se encontraron productos.",
      };
    res.status(200).json({ message: "El producto a sido eliminado." });
  } catch (error) {
    res.status(error.errorStatus || 500).json({ message: error.message });
  }
};
