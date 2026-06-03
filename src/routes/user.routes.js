const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 📌 Crear usuario
router.post("/", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // 🔍 Verificar si ya existe
    const existe = await User.findOne({ email });

    if (existe) {
      return res.status(400).json({
        error: "El email ya está registrado"
      });
    }

    // 🔐 Encriptar password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nombre,
      email,
      password: hashedPassword
    });

    res.json({
      message: "Usuario creado",
      user
    });

  } catch (err) {
    console.error("❌ Error creando usuario:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;