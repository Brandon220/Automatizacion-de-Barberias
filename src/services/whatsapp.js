const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
let cliente = null;
async function iniciarWhatsApp() {
  return new Promise((resolve) => {
    cliente = new Client({
      authStrategy: new LocalAuth({ clientId: "barberia" }),
      puppeteer: {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || require("puppeteer").executablePath(),
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--single-process",
        ],
      },
    });
    cliente.on("qr", (qr) => {
      console.log("\n📱 Escaneá este QR con WhatsApp:\n");
      qrcode.generate(qr, { small: true });
    });
    cliente.on("ready", () => {
      console.log("✅ WhatsApp conectado correctamente");
      resolve(cliente);
    });
    cliente.on("auth_failure", (msg) => {
      console.error("❌ Error de autenticación:", msg);
    });
    cliente.on("disconnected", (reason) => {
      console.log("⚠️ WhatsApp desconectado:", reason);
    });
    cliente.initialize();
  });
}
function formatPhone(telefono) {
  const limpio = (telefono || "").replace(/\D/g, "");
  const numero = limpio.length >= 10 ? limpio : "506" + limpio;
  return `${numero}@c.us`;
}
async function enviarMensaje(telefono, texto) {
  if (!cliente) {
    console.error("❌ WhatsApp no está iniciado todavía");
    return;
  }
  try {
    const chatId = formatPhone(telefono);
    await cliente.sendMessage(chatId, texto);
    console.log("📨 Mensaje enviado a", telefono);
  } catch (err) {
    console.error("❌ Error enviando mensaje a", telefono, ":", err.message);
  }
}
module.exports = { iniciarWhatsApp, enviarMensaje };
