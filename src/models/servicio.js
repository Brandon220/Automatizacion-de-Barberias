const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
  nombre: String,
  duracion: Number,
  precio: Number
}, { timestamps: true });

module.exports = mongoose.model('Servicio', servicioSchema);