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

module.exports = router