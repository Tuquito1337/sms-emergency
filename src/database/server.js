import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let db;

// Función para iniciar la conexión a MySQL
const startServer = async () => {
  try {
    db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "sistemas_emergencias",
    });
    console.log("Conexión a MySQL exitosa");

    // Iniciar el servidor
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Error al conectar a MySQL:", err);
  }
};

// Ruta de inicio de sesión
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Faltan datos" });
  }

  const query = "SELECT * FROM usuarios WHERE nombre = ? AND password = ?";
  try {
    const [results] = await db.execute(query, [username, password]);

    if (results.length > 0) {
      res.json({ success: true, message: "Inicio de sesión exitoso" });
    } else {
      res.json({ success: false, message: "Credenciales incorrectas" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

// Iniciar la conexión y el servidor
startServer();
