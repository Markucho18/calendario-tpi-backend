const jwt = require("jsonwebtoken")
const SECRET_KEY = require("../secretKey")

const crearToken = (id, nombre, expiracion) => {
  const payload = {id, nombre}
  const token = jwt.sign(payload, SECRET_KEY, {expiresIn: expiracion})
  return token
}

module.exports = crearToken