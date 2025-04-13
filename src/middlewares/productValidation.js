export const productValidation = (req, res, next) => {
  const product = {
    ...req.body,
    image: req.file.buffer,
  };
  if (
    !product.name ||
    !product.description ||
    !product.category ||
    !product.price ||
    !product.isOffer
  ) {
    return res
      .status(400)
      .json({ message: "Debe rellenar todos los campos de tipo obligatorio." });
  }
  if (product.name.length < 3 || product.name.length > 50) {
    return res.status(400).json({
      message:
        "El nombre del producto debe tener un minimo de 3 caracteres y un maximo de 50.",
    });
  }
  if (product.description.length < 10 || product.description.length > 500) {
    return res.status(400).json({
      message:
        "La descripcion del producto debe tener un minimo de 10 caracteres y un maximo de 500.",
    });
  }
  /*   if (typeof product.price !== "number") {
    return res
      .status(400)
      .json({ message: "El precio del producto debe ser un numero." });
  } */
  /*   if (product.price < 0) {
    return res
      .status(400)
      .json({ message: "El precio del producto no puede ser menor a 0." });
  } */
  /*   if (typeof product.isOffer !== "boolean") {
    return res
      .status(400)
      .json({ message: "El campo de oferta debe ser un booleano." });
  } */
  console.log("passed validation");
  req.body = {
    ...product,
  };
  next();
};
