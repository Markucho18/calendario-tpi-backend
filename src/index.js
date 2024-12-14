require("dotenv").config()
const PORT = process.env.PORT || 3001
const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")

app.use(express.json())

app.use(cors(
//Esto configurarlo despues
/* {
  origin: "http://localhost:5173",
  credentials: true
} */
))

app.get("/", (req, res) => {
  res.send("Consulta get xd")
})

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`)
})