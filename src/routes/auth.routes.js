const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // O "bcrypt" si lo instalaste así
const jwt = require("jsonwebtoken");
const User = require('../models/user'); // Importamos el modelo de usuario

// 📌 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Usuario no existe" });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { 
        id: user._id,
        nombre: user.nombre,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;