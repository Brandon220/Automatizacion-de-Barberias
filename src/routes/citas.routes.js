const express = require("express");
const router = express.Router();

const Cita = require('../models/cita');
const enviarNotificacion = require("../utils/notify");

// ⏱️ Duración por servicio
const DURACION_SERVICIOS = {
  "Corte": 30,
  "Corte de pelo + barba": 60,
  "Corte de pelo + cejas": 40,
  "Perfilar barba": 20
};

// 📌 Crear cita
router.post("/", async (req, res) => {
  try {
    let { nombre, telefono, servicio, fecha, horaInicio } = req.body;

    console.log("📥 Nueva solicitud:", req.body);

    // 🔥 VALIDACIÓN
    if (!nombre || !telefono || !servicio || !fecha || !horaInicio) {
      return res.status(400).json({
        error: "Faltan datos"
      });
    }

    // 🔥 LIMPIAR TELÉFONO
    telefono = telefono.replace(/\D/g, "");

    // 🔥 VALIDAR TELÉFONO (8 a 15 dígitos)
    if (!/^\d{8,15}$/.test(telefono)) {
      return res.status(400).json({
        error: "Teléfono inválido"
      });
    }

    // 🔥 ANTI-SPAM (máx 3 citas por día por número)
    const citasDelCliente = await Cita.countDocuments({
      telefono,
      fecha
    });

    if (citasDelCliente >= 3) {
      return res.status(400).json({
        error: "Límite de citas alcanzado para este día"
      });
    }

    const duracion = DURACION_SERVICIOS[servicio] || 30;

    const [h, m] = horaInicio.split(":").map(Number);

    const inicio = new Date();
    inicio.setHours(h, m);

    const fin = new Date(inicio.getTime() + duracion * 60000);
    const horaFin = fin.toTimeString().slice(0, 5);

    // 🚫 evitar solapamientos
    const citas = await Cita.find({ fecha });

    const choque = citas.find(c => {
      if (!c.horaInicio || !c.horaFin) return false;

      return (
        horaInicio < c.horaFin &&
        horaFin > c.horaInicio
      );
    });

    if (choque) {
      return res.status(400).json({
        error: "Horario ocupado"
      });
    }

    // 💾 Crear cita
    const cita = await Cita.create({
      nombre,
      telefono,
      servicio,
      fecha,
      horaInicio,
      horaFin
    });

    console.log("✅ Cita creada:", cita._id);

    // 📲 WhatsApp (cliente + barbero)
    await enviarNotificacion(cita);

    // ⚡ tiempo real
    const io = req.app.get("io");

    if (io) {
      io.emit("nueva-cita", {
        nombre,
        telefono,
        servicio,
        fecha,
        hora: horaInicio
      });
    }

    res.json(cita);

  } catch (err) {
    console.error("❌ Error creando cita:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📌 Cancelar cita por ID (panel web)
router.delete("/:id", async (req, res) => {
  try {
    const cita = await Cita.findByIdAndDelete(req.params.id);

    if (!cita) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    console.log("❌ Cita cancelada:", cita.nombre);

    res.json({ msg: "Cita cancelada" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Obtener citas
router.get("/", async (req, res) => {
  try {
    const citas = await Cita.find().sort({ fecha: 1, horaInicio: 1 });
    res.json(citas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Horarios disponibles
router.get("/horarios/:fecha", async (req, res) => {
  try {
    const { fecha } = req.params;

    console.log("📅 Fecha recibida:", fecha);

    const horasBase = [
      "09:00", "09:30",
      "10:00", "10:30",
      "11:00", "11:30",
      "12:00",
      "14:00", "14:30",
      "15:00", "15:30"
    ];

    const citas = await Cita.find({ fecha });

    const disponibles = horasBase.filter(hora => {
      const conflicto = citas.find(c => {
        if (!c.horaInicio || !c.horaFin) return false;

        return (
          hora < c.horaFin &&
          hora >= c.horaInicio
        );
      });

      return !conflicto;
    });

    console.log("✅ Disponibles:", disponibles);

    res.json(disponibles);

  } catch (err) {
    console.error("❌ ERROR HORARIOS:", err);
    res.status(500).json({
      error: "Error obteniendo horarios"
    });
  }
});

module.exports = router;