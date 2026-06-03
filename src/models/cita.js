const mongoose = require("mongoose");

const citaSchema = new mongoose.Schema({
  // 👤 Cliente (usuario logueado)
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },

  // 🧾 Datos manuales (sin login)
  nombre: String,
  telefono: String,

  // 💈 Servicio
  servicio: String,

  // 📅 Fecha y horas
  fecha: String,
  horaInicio: String,
  horaFin: String,

  // 🔔 Control de recordatorio
  recordatorioEnviado: {
    type: Boolean,
    default: false
  },

  // ✂️ Barbero
  barberoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 🔥 Evita duplicar citas en misma hora
citaSchema.index({ fecha: 1, horaInicio: 1 }, { unique: true });

module.exports = mongoose.model("Cita", citaSchema);