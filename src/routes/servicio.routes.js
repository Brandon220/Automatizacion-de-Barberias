const router = require('express').Router();
const Servicio = require('../models/Servicio');

// 📌 Obtener todos
router.get('/', async (req, res) => {
  res.json(await Servicio.find());
});

// 📌 Crear nuevo
router.post('/', async (req, res) => {
  const s = new Servicio(req.body);
  res.json(await s.save());
});

// 📌 Editar servicio (LA MEJORA)
router.put('/:id', async (req, res) => {
  try {
    const { nombre, precio } = req.body;
    const s = await Servicio.findByIdAndUpdate(req.params.id, { nombre, precio }, { new: true });
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: "No se pudo actualizar" });
  }
});

module.exports = router;