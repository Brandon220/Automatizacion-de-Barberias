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
const path = require("path");
const app = express();
app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../")));
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB conectado");
    require("./utils/reminder");
    const { iniciarWhatsApp } = require("./services/whatsapp");
    await iniciarWhatsApp();
  })
  .catch(err => console.log("❌ Error MongoDB:", err));
// ── Rutas ─────────────────────────────────────
app.use("/api/auth",     require("./routes/auth.routes"));
app.use("/api/barberos", require("./routes/barberos.routes"));
app.use("/api/citas",    require("./routes/citas.routes"));
app.use("/api/servicio", require("./routes/servicio.routes"));
app.use("/api/users",    require("./routes/user.routes"));
app.use("/api/webhook",  require("./routes/webhook.routes"));
// ── QR WhatsApp ───────────────────────────────
app.get("/qr", (req, res) => {
  const { getQRImage } = require("./services/whatsapp");
  const qr = getQRImage();
  if (qr) {
    res.send(`<html><body style="display:flex;justify-content:center;align-items:center;height:100vh;background:#111"><img src="${qr}" style="width:300px"/></body></html>`);
  } else {
    res.send("WhatsApp ya está conectado o el QR aún no está listo.");
  }
});
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
