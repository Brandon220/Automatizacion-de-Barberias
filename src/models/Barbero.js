const mongoose = require("mongoose");

const barberoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  especialidad: { type: String, default: "Barbero Experto" },
  avatarInitials: { type: String },
  activo: { type: Boolean, default: true } // Permite despedir/dar de baja sin borrar historial
}, { timestamps: true });

module.exports = mongoose.model("Barbero", barberoSchema);