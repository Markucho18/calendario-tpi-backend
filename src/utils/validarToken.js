const jwt = require("jsonwebtoken")
const SECRET_KEY = require("../secretKey")
const crearToken = require("./crearToken")

const validarToken = (req, res, next) => {
  const accessToken = req.cookies?.accessToken
  const refreshToken = req.cookies?.refreshToken
  console.log({accessToken, refreshToken})
  if(accessToken){
    console.log("Hay accessToken")
    try{
      const decoded = jwt.verify(accessToken, SECRET_KEY)
      const {id, nombre} = decoded
      req.usuario = {id, nombre}
      return next()
    } catch(error){
      if(error.name !== "TokenExpiredError"){
        return res.status(403).json({msg: "accessToken invalido"})
      }
      console.log("Expiro el accessToken")
    }
  }
  if(refreshToken){
    console.log("Hay refreshToken")
    try{
      const decoded = jwt.verify(refreshToken, SECRET_KEY)
      const {id, nombre} = decoded
      const nuevoAccessToken = crearToken(id, nombre, "1h")
      res.cookie("accessToken", nuevoAccessToken, {httpOnly: true, secure: false, sameSite: "lax", maxAge: 60 * 60 * 1000})
      req.usuario = {id, nombre}
      return next()
    } catch(error){
      return res.status(403).json({ message: "refreshToken invalido" });
    }
  }
  return res.status(401).json({msg: "Debes iniciar sesion de nuevo"})
}

module.exports = validarToken