import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authModel from "../schemas/authModel.js";
import { verifyCaptcha } from "../libs/verifyCaptcha.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatiorios." });
  }

  try {
    const user = await authModel.findOne({ email });

    if (!user)
      throw {
        errorStatus: 400,
        message: "Correo electronico o contraseña incorrectos.",
      };

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      throw {
        errorStatus: 400,
        message: "La contraseña es incorrecta.",
      };

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    if (!token)
      throw {
        errorStatus: 500,
        message: "A ocurrido un error al crear la seción.",
      };

    return res.status(200).json({
      message: "Usuario autenticado con exito.",
      token,
      user: { email: user.email, id: user._id },
    });
  } catch (error) {
    console.log(error);

    return res.status(error.errorStatus).json({ message: error.message });
  }
};

export const verifyUser = async (req, res) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({ message: "No autorizado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await authModel.findOne({ email: decoded.email });

    if (!user)
      throw {
        errorStatus: 400,
        message: "A ocurrido un error al verificar el usuario.",
      };
    return res.status(200).json({
      message: "Usuario autenticado con exito.",
      user: { email: user.email, id: user._id },
    });
  } catch (error) {
    return res.status(401).json({ message: "No autorizado." });
  }
};

export const createUser = async (req, res) => {
  const { username, email, password, brand, captcha } = req.body;
  console.log(req.body);

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatiorios." });
  }

  try {
    const isValidCaptcha = await verifyCaptcha(captcha);

    if (!isValidCaptcha)
      throw {
        errorStatus: 400,
        message: "A ocurrido un error al intentar validar el CAPTCHA.",
      };
    const emailMatch = await authModel.findOne({ email });

    if (emailMatch)
      throw {
        errorStatus: 400,
        message: "A ocurrido un error al crear el nuevo usuario.",
      };

    const usernameMatch = await authModel.findOne({ username });

    if (usernameMatch)
      throw {
        errorStatus: 400,
        message: "A ocurrido un error al crear el nuevo usuario.",
      };

    if (brand) {
      const brandMatch = await authModel.findOne({ brand });

      if (brandMatch)
        throw {
          errorStatus: 400,
          message:
            "El nombre de su marca debe ser unico, en estos momentos otro cliente esta ocupando ese nombre.",
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!hashedPassword)
      throw {
        errorStatus: 500,
        message: "A ocurrido un error al crear el nuevo usuario.",
      };

    const user = new authModel({
      username,
      email,
      password: hashedPassword,
      brand,
    });

    const newUser = await user.save();
    if (!newUser)
      throw { errorStatus: 500, message: "Error al crear el usuario." };

    /* No se usa el jwt en el registro para que el usuario deba autenticarse desde el front */

    /*     const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    if (!token)
      throw {
        errorStatus: 500,
        message:
          "Error al autenticar el usuario. Por favor valla a iniciar sesión.",
      }; */

    return res.status(200).json({
      message: "Nuevo usuario creado. Por favor inice seción.",
    });
  } catch (error) {
    console.log(error);

    return res
      .status(error.errorStatus || 500)
      .json({ message: error.message });
  }
};
