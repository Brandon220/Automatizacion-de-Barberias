const mongoose = require("mongoose");

// Cambia la línea de 'module.exports = mongoose.model("User", UserSchema);' 
// por esta estructura:

const UserSchema = new mongoose.Schema({
  // ... (tus campos actuales, nombre, email, password, etc.)
  nombre: String,
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String, default: 'user' }
});

// ESTA ES LA CLAVE: verifica si ya existe antes de crearlo
module.exports = mongoose.models.User || mongoose.model("User", UserSchema);