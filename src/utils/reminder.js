// ─────────────────────────────────────────────
//  src/utils/reminder.js
//  Recordatorios automáticos con node-cron
// ─────────────────────────────────────────────

const cron = require("node-cron");
const Cita = require('../models/cita');
const { enviarMensaje } = require("../services/whatsapp");

const BARBER_PHONE = process.env.BARBER_PHONE;

// ── Cron: corre cada minuto ───────────────────
cron.schedule("* * * * *", async () => {
  try {
    const ahora = new Date();
    const citas = await Cita.find({ recordatorioEnviado: { $ne: true } });

    for (let cita of citas) {
      if (!cita.horaInicio || !cita.fecha) continue;

      const telefonoLimpio = (cita.telefono || "").replace(/\D/g, "");
      if (!telefonoLimpio) {
        console.log("⚠️ Teléfono inválido en cita:", cita._id);
        continue;
      }

      // Calcular tiempo restante
      const [h, m] = cita.horaInicio.split(":");
      const fechaCita = new Date(cita.fecha);
      fechaCita.setHours(Number(h), Number(m), 0, 0);

      const diffMinutos = (fechaCita - ahora) / 60000;

      // 🧪 MODO PRUEBA: avisa entre 1 y 2 minutos antes
      // 🚀 PRODUCCIÓN: cambiá a (diffMinutos <= 1440 && diffMinutos > 1439) para 24h antes
      if (diffMinutos <= 1440 && diffMinutos > 1439) {
        console.log("📲 Enviando recordatorio a:", cita.nombre);

        // ─── 👤 Recordatorio al CLIENTE ──────────
        await enviarMensaje(
          telefonoLimpio,
`⏰ *Recordatorio de cita — Barbería* ✂️

Hola ${cita.nombre} 👋

Tu cita es muy pronto:

✂️ Servicio: ${cita.servicio}
📅 Fecha: ${cita.fecha}
⏰ Hora: ${cita.horaInicio}

¡Te esperamos! 💈`
        );

        // ─── 💈 Recordatorio al BARBERO ──────────
        if (BARBER_PHONE) {
          await enviarMensaje(
            BARBER_PHONE,
`⏰ *Recordatorio de cita*

👤 Cliente: ${cita.nombre}
📞 Teléfono: ${telefonoLimpio}
✂️ Servicio: ${cita.servicio}
📅 Fecha: ${cita.fecha}
⏰ Hora: ${cita.horaInicio}`
          );
        }

        // ✅ Marcar como enviado para no repetir
        await Cita.findByIdAndUpdate(cita._id, { recordatorioEnviado: true });
        console.log("✅ Recordatorio enviado a:", cita.nombre);
      }
    }

  } catch (err) {
    console.error("❌ Error en cron de recordatorios:", err.message);
  }
});

console.log("🕐 Recordatorios automáticos activados");