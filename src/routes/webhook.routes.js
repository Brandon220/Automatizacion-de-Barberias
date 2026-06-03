const express = require("express");
const router = express.Router();

const Cita = require("../models/Cita");

router.post("/whatsapp", async (req, res) => {
  try {
    const mensaje = (req.body.Body || "").toLowerCase().trim();
    const numero = req.body.From;

    console.log("📩 Mensaje recibido:", mensaje);
    console.log("📞 De:", numero);

    if (mensaje === "cancelar") {

      // 🔥 Limpia el número (quita whatsapp:+ y código país)
      const telefono = numero
        .replace("whatsapp:", "")
        .replace("+", "")
        .slice(-8); // 👈 deja solo los últimos 8 dígitos

      console.log("📱 Teléfono limpio:", telefono);

      // 🔥 CANCELA SOLO LA ÚLTIMA CITA
      const cita = await Cita.findOneAndDelete(
        { telefono },
        { sort: { fecha: -1, horaInicio: -1 } }
      );

      if (cita) {
        console.log("❌ Cita cancelada:", cita.nombre);

        return res.send(`
          <Response>
            <Message>❌ Tu cita ha sido cancelada correctamente</Message>
          </Response>
        `);
      } else {
        return res.send(`
          <Response>
            <Message>No tienes citas registradas</Message>
          </Response>
        `);
      }
    }

    // 🔥 Respuesta por defecto
    return res.send(`
      <Response>
        <Message>Escribe CANCELAR para eliminar tu cita</Message>
      </Response>
    `);

  } catch (err) {
    console.error("❌ Error webhook:", err);
    res.sendStatus(500);
  }
});

module.exports = router;