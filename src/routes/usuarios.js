const express = require("express")
const router = express.Router()
const pool = require("../pool")
const encriptarContrasena = require("../utils/encriptarContrasena")
const validarNombre = require("../utils/validarNombre")
const bcrypt = require("bcryptjs")
const crearToken = require("../utils/crearToken")
const validarToken = require("../utils/validarToken")

router.get("/", async (req, res) => {
  res.json({msg: "Hola desde usuarios.js"})
})

router.post("/iniciar-sesion", async (req, res) => {
  try{
    const {nombre, contrasena} = req.body
    const query = "SELECT * FROM usuarios WHERE nombre = ?"
    const [rows] = await pool.query(query, [nombre])
    if(rows.length === 0) return res.status(404).json({msg: "Usuario no encontrado"})
    const id = rows[0].id
    const contrasenaEncriptada = rows[0].contrasena
    const esValida = await bcrypt.compare(contrasena, contrasenaEncriptada)
    if(!esValida) return res.status(401).json({msg: "Contraseña no coincide"})
    const accessToken = crearToken(id, nombre, "1h")
    const refreshToken = crearToken(id, nombre, "7d")
    res.cookie("accessToken", accessToken, {httpOnly: true, secure: false, sameSite: "lax", maxAge: 60 * 60 * 1000})
    res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: false, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000})
    return res.json({msg: "Sesion iniciada correctamente", datosUsuario: {id, nombre}})
  } catch(error){
    console.log(error)
  }
})

router.post("/cerrar-sesion", (req, res) => {
  res.clearCookie("accessToken", {httpOnly: true, secure: false, sameSite: "lax"})
  res.clearCookie("refreshToken", {httpOnly: true, secure: false, sameSite: "lax"})
  res.json({msg: "Cookies eliminadas en teoria"})
})

router.post("/registrar", validarNombre, async (req, res) => {
  try{
    const {nombre, contrasena} = req.body
    const contrasenaEncriptada = await encriptarContrasena(contrasena)
    const query = "INSERT INTO usuarios (nombre, contrasena) VALUES (?, ?)"
    const results = await pool.query(query, [nombre, contrasenaEncriptada])
    if(results[0].affectedRows === 0) return res.json({msg: "No se pudo registrar usuario", results})
    return res.json({msg: "Usuario registrado correctamente", results})
  } catch(error){
    console.log(error)
  }
})

router.post("/validar-token", validarToken, (req, res) => {
  res.json({msg: "El token es valido", usuario: req.usuario})
})


module.exports = router