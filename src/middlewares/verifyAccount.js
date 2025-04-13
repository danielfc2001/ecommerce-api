import jwt from "jsonwebtoken";
import authModel from "../schemas/authModel.js";

export const verifyAccount = async (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    console.log("Token no encontrado.");
    throw {
      errorStatus: 403,
      message: "Token no encontrado.",
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await authModel.findById(decoded.id);
    if (!user)
      throw {
        errorStatus: 400,
        message: "A ocurrido un error al verificar el usuario.",
      };
    req.body = {
      ...req.body,
      id: user._id,
    };
    console.log("user validation passed");
    next();
  } catch (error) {
    return res
      .status(error.errorStatus || 500)
      .json({ message: error.message });
  }
};
