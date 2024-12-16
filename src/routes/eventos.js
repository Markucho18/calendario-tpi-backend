const express = require("express")
const router = express.Router()
const pool = require("../pool")

router.get("/", async (req, res) => {
  try{
    const query = "SELECT * FROM eventos"
    const [rows] = await pool.query(query)
    res.json({msg: "Eventos obtenidos", rows})
  } catch(error){
    res.status(500).json({msg: "Ocurrio un error"})
  }
})

router.post("/crear", async (req, res) => {
  try{
    const {id_usuario, nombre, fecha, hora_inicio, hora_final, categoria, descripcion} = req.body
    const query = "INSERT INTO eventos (id_usuario, nombre, fecha, hora_inicio, hora_final, categoria, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)"
    const results = await pool.query(query, [id_usuario, nombre, fecha, hora_inicio, hora_final, categoria, descripcion])
    if(results[0].affectedRows === 0) return res.status(500).json({msg: "Hubo un error"})
    return res.json({msg: "Evento creado correctamente"})
  } catch(error){
    console.log(error)
    return res.status(500).json({msg: "Hubo un error"})
  }
})

router.delete("/borrar/:id", async (req, res) => {
  try{
    const {id} = req.params
    const query = "DELETE FROM eventos WHERE id = ?"
    const results = await pool.query(query, [id])
    if(results[0].affectedRows === 0) return res.status(500).json({msg: "Hubo un error"})
    return res.json({msg: "Evento borrado correctamente"})
  } catch(error){
    console.log(error)
    return res.status(500).json({msg: "Hubo un error"})
  }
})

module.exports = router