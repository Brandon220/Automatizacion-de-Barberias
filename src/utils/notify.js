// ─────────────────────────────────────────────
//  src/utils/notify.js
//  Notificación al cliente y barbero al crear cita
// ─────────────────────────────────────────────

const { enviarMensaje } = require("../services/whatsapp");

const BARBER_PHONE = process.env.BARBER_PHONE;

async function enviarNotificacion(cita) {
  try {
    // ─── 👤 Mensaje al CLIENTE ─────────────────
    await enviarMensaje(
      cita.telefono,
`✅ *Cita confirmada — Barbería* ✂️

Hola ${cita.nombre} 👋

Tu cita quedó agendada correctamente:

✂️ Servicio: ${cita.servicio}
📅 Fecha: ${cita.fecha}
⏰ Hora: ${cita.horaInicio} — ${cita.horaFin}

¡Te esperamos! 💈`
    );

    // ─── 💈 Mensaje al BARBERO ─────────────────
    if (BARBER_PHONE) {
      await enviarMensaje(
        BARBER_PHONE,
`🔔 *Nueva cita agendada*

👤 Cliente: ${cita.nombre}
📞 Teléfono: ${cita.telefono}
✂️ Servicio: ${cita.servicio}
📅 Fecha: ${cita.fecha}
⏰ Hora: ${cita.horaInicio} — ${cita.horaFin}`
      );
    }

  } catch (err) {
    console.error("❌ Error en notificación WhatsApp:", err.message);
  }
}

module.exports = enviarNotificacion;