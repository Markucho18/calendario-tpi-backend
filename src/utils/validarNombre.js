const pool = require("../pool")

const validarNombre = async (req, res, next) => {
  try{
    const {nombre} = req.body
    const query = "SELECT * FROM usuarios WHERE nombre = ?"
    const [rows] = await pool.query(query, [nombre])
    if(rows.length > 0) return res.status(401).json({msg: "Ese usuario ya esta en uso"}) 
    next()
  } catch(error){
    console.log(error)
  }
}

module.exports = validarNombre