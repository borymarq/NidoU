const rooms = [
  {
    id: 1,
    title: "Cuarto individual - Prosperina",
    sector: "ESPOL",
    price: 160,
    transport: "4 min a pie de parada Expreso ESPOL (10 min al campus)",
    inspection: "Fotos reales auditadas · Agua, luz, internet y cerradura verificados"
  },
  {
    id: 2,
    title: "Habitación en casa compartida - Sauces 6",
    sector: "Sauces",
    price: 180,
    transport: "3 min a paradero Ruta Norte ESPOL (22 min al campus)",
    inspection: "Fotos reales auditadas · Servicios incluidos y área de estudio verificada"
  },
  {
    id: 3,
    title: "Habitación con baño privado - Urdesa",
    sector: "Urdesa",
    price: 220,
    transport: "2 min a parada segura con expreso directo (25 min al campus)",
    inspection: "Fotos reales auditadas · Servicios básicos incluidos y seguridad validada"
  }
];

function renderRooms(list) {
  const container = document.getElementById("roomsList");
  if (list.length === 0) {
    container.innerHTML = "<p>No hay cuartos con esos filtros.</p>";
    return;
  }

  container.innerHTML = list
    .map(
      (room) => `
      <div class="card">
        <span class="badge">Verificado presencialmente</span>
        <h3>${room.title}</h3>
        <p><strong>Tarifa plana:</strong> $${room.price}/mes (agua, luz, internet)</p>
        <p><strong>Ruta:</strong> ${room.transport}</p>
        <button onclick="selectRoom(${room.id})">Evaluar y probar reserva</button>
      </div>
    `
    )
    .join("");
}

function filterRooms() {
  const sector = document.getElementById("sectorFilter").value;
  const maxPrice = Number(document.getElementById("priceFilter").value);

  const filtered = rooms.filter(
    (r) => (sector === "all" || r.sector === sector) && r.price <= maxPrice
  );
  renderRooms(filtered);
}

function selectRoom(id) {
  const room = rooms.find((r) => r.id === id);
  const detailBox = document.getElementById("detailBox");
  const content = document.getElementById("roomDetailContent");

  detailBox.classList.remove("hidden");
  content.innerHTML = `
    <h3>${room.title} — $${room.price}/mes (Todo incluido)</h3>
    <p style="margin-top:6px;"><strong>Auditoría:</strong> ${room.inspection}</p>
    <p style="margin-top:4px;"><strong>Movilidad:</strong> ${room.transport}</p>

    <div class="escrow-note">
      <strong>Garantía en custodia (Escrow):</strong> Tu depósito queda retenido por NidoU y solo se entrega al arrendador cuando recibes el cuarto conforme al contrato semestral. Comisión de gestión: $12.
    </div>

    <div class="form-row">
      <input type="text" id="studentMat" placeholder="Matrícula / Cédula estudiante" />
      <input type="text" id="parentName" placeholder="Nombre del padre/garante" />
      <button onclick="confirmReservation('${room.title}', ${room.price})">Simular reserva</button>
    </div>
    <p id="bookingStatus" class="result"></p>
  `;

  detailBox.scrollIntoView({ behavior: "smooth" });
}

function confirmReservation(title, price) {
  const mat = document.getElementById("studentMat").value.trim();
  const parent = document.getElementById("parentName").value.trim();
  const status = document.getElementById("bookingStatus");

  if (!mat || !parent) {
    status.style.color = "#b91c1c";
    status.textContent = "Completa matrícula/cédula y nombre del garante para probar el flujo.";
    return;
  }

  status.style.color = "#137333";
  status.textContent = `Reserva simulada para "${title}" ($${price}/mes todo incluido). Garante registrado: ${parent}. Garantía en custodia activa.`;
}

function checkMatch() {
  const study = document.getElementById("studyHabit").value;
  const clean = document.getElementById("cleanHabit").value;
  const score = study === "noche" && clean === "ordenado" ? "95%" : "86%";

  document.getElementById("matchOutput").textContent =
    `Compatibilidad estimada: ${score} con perfil universitario (${study}, ${clean}).`;
}

renderRooms(rooms);
