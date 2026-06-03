const express = require("express");
const router = express.Router();
const Barbero = require("../models/Barbero");

// Obtener todos
router.get("/", async (req, res) => {
  try {
    const barberos = await Barbero.find();
    res.json(barberos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear uno nuevo
router.post("/", async (req, res) => {
  try {
    const { nombre, especialidad, activo, avatarInitials } = req.body;
    const nuevoBarbero = new Barbero({ 
      nombre, 
      especialidad: especialidad || "Barbero Profesional", 
      activo: activo !== false,
      avatarInitials 
    });
    await nuevoBarbero.save();
    res.status(201).json(nuevoBarbero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar
router.put("/:id", async (req, res) => {
  try {
    const { nombre, especialidad, activo, avatarInitials } = req.body;
    const barberoActualizado = await Barbero.findByIdAndUpdate(
      req.params.id,
      { nombre, especialidad, activo, avatarInitials },
      { new: true }
    );
    res.json(barberoActualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar
router.delete("/:id", async (req, res) => {
  try {
    await Barbero.findByIdAndDelete(req.params.id);
    res.json({ msg: "Eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;