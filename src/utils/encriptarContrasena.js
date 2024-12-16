const bcrypt = require("bcryptjs")

const saltRounds = 10

const encriptarContrasena = async (contrasena) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds); // Generamos el "salt"
    const contrasenaEncriptada = await bcrypt.hash(contrasena, salt); // Encriptamos la contraseña con el salt
    console.log({contrasenaEncriptada});
    return contrasenaEncriptada;
  } catch (error) {
    console.error(error);
  }
}

module.exports = encriptarContrasena