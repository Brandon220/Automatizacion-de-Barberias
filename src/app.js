// ─────────────────────────────────────────────
//   src/app.js
// ─────────────────────────────────────────────
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const path = require("path"); // Importamos path

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB conectado");
    require("./utils/reminder");
    const { iniciarWhatsApp } = require("./services/whatsapp");
    await iniciarWhatsApp();
  })
  .catch(err => console.log("❌ Error MongoDB:", err));

// ── Rutas ─────────────────────────────────────
// Al estar app.js y la carpeta 'routes' dentro de 'src', 
// usamos ./routes/nombre-del-archivo para encontrarlos.

app.use("/api/auth",     require("./routes/auth.routes"));
app.use("/api/barberos", require("./routes/barberos.routes"));
app.use("/api/citas",    require("./routes/citas.routes"));
app.use("/api/servicio", require("./routes/servicio.routes"));
app.use("/api/users",    require("./routes/user.routes"));
app.use("/api/webhook",  require("./routes/webhook.routes"));

// ── Servidor + Sockets ────────────────────────
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.set("io", io);

io.on("connection", (socket) => {
  console.log("⚡ Cliente conectado:", socket.id);
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Servidor corriendo en puerto ${process.env.PORT || 3000}`);
});