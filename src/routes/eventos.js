const express = require("express")
const router = express.Router()
const pool = require("../pool")

router.get("/", async (req, res) => {
  try{
    const id_usuario = req.usuario.id
    const query = "SELECT * FROM eventos WHERE id_usuario = ?"
    const [rows] = await pool.query(query, [id_usuario])
    res.json({msg: "Eventos obtenidos", rows})
  } catch(error){
    res.status(500).json({msg: "Ocurrio un error"})
  }
})

router.post("/crear", async (req, res) => {
  try{
    const id_usuario = req.usuario.id
    const {nombre, fecha, hora_inicio, hora_final, categoria, descripcion} = req.body
    const query = "INSERT INTO eventos (id_usuario, nombre, fecha, hora_inicio, hora_final, categoria, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)"
    const results = await pool.query(query, [id_usuario, nombre, fecha, hora_inicio, hora_final, categoria, descripcion])
    if(results[0].affectedRows === 0) return res.status(500).json({msg: "Hubo un error"})
    return res.json({msg: "Evento creado correctamente", id_evento: results[0].insertId})
  } catch(error){
    console.log(error)
    return res.status(500).json({msg: "Hubo un error"})
  }
})

router.put("/editar", async (req, res)=>{
  try{
    const id_usuario = req.usuario.id
    const {id, nombre, fecha, hora_inicio, hora_final, categoria, descripcion} = req.body
    const query = `
      UPDATE eventos
      SET 
        id_usuario = ?, 
        nombre = ?, 
        fecha = ?, 
        hora_inicio = ?, 
        hora_final = ?, 
        categoria = ?, 
        descripcion = ?
      WHERE id = ?
    `;
    const results = await pool.query(query, [id_usuario, nombre, fecha, hora_inicio, hora_final, categoria, descripcion, id])
    if(results[0].affectedRows === 0) return res.status(500).json({msg: "Hubo un error"})
    return res.json({msg: "Evento editado correctamente"})
  } catch(error){
    console.log(error)
    return res.status(500).json({msg: "Hubo un error"})
  }
})

router.delete("/borrar/:id", async (req, res) => {
  console.log("Solicitud borrar evento")
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