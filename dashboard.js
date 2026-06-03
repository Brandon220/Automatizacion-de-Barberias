// 🔐 VERIFICAR LOGIN
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "admin") {
  alert("No autorizado");
  window.location.href = "login.html";
}

// ⚡ SOCKET.IO (tiempo real)
const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Conectado a sockets:", socket.id);
});

socket.on("nueva-cita", (data) => {
  alert(`🔥 Nueva cita agendada

Cliente: ${data.cliente}
Fecha: ${data.fecha}
Hora: ${data.hora}`);

  // recargar citas automáticamente
  loadCitas();
});

// 📌 USUARIOS
async function loadUsers() {
  document.getElementById("title").innerText = "Usuarios";

  const res = await fetch("http://localhost:3000/api/users", {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const data = await res.json();

  document.getElementById("data").innerHTML =
    data.map(u => `
      <div class="card">
        <p><b>${u.nombre}</b></p>
        <p>${u.email}</p>
        <p>${u.role}</p>
      </div>
    `).join("");
}

// 📌 CITAS
async function loadCitas() {
  document.getElementById("title").innerText = "Citas";

  const res = await fetch("http://localhost:3000/api/citas", {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const data = await res.json();

  document.getElementById("data").innerHTML =
    data.map(c => `
      <div class="card">
        <p><b>Cliente: ${
          c.cliente?.nombre || c.nombre || "Sin nombre"
        }</b></p>

        <p>📅 Fecha: ${c.fecha}</p>
        <p>⏰ Hora: ${c.horaInicio || c.hora || "N/A"}</p>
        <p>💈 Servicio: ${c.servicio}</p>
      </div>
    `).join("");
}

// 🚪 LOGOUT
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "login.html";
}