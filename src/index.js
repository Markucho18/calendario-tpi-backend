require("dotenv").config()
const PORT = process.env.PORT || 3001
const express = require("express")
const app = express()
const cors = require("cors")
const pool = require("./pool")
const cookieParser = require("cookie-parser")
const validarToken = require("./utils/validarToken")

app.use(express.json())

app.use(cors({
  origin: true,
  credentials: true,
}))
//Despues poner "http://localhost:5173" y link del frontend en hosting

app.use(cookieParser())

const usuariosRouter = require("./routes/usuarios")
app.use("/usuarios", usuariosRouter)

const eventosRouter = require("./routes/eventos")
app.use("/eventos", validarToken, eventosRouter)

app.get("/", async (req, res) => {
  try{
    const query = "SELECT * FROM usuarios"
    const [rows] = await pool.query(query, [])
    if(rows.length > 0) return res.json({msg: "Usuarios obtenidos exitosamente", rows}) 
    return res.json({msg: "Me pican los cocos"})
  } catch(error){
    console.log(error)
  }
})


app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`)
})