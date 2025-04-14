const SECRET_KEY = process.env.CAPTCHA_SECRET;

export const verifyCaptcha = async (token) => {
  if (!token) {
    throw new Error("El token del CAPTCHA es inválido o está vacío.");
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${SECRET_KEY}&response=${token}`,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error en la solicitud: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error al verificar el CAPTCHA:", error);
    throw new Error("No se pudo verificar el CAPTCHA.");
  }
};
