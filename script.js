const bookingForm = document.querySelector("#booking-form");
const dateInput = document.querySelector("#date");
const timeInput = document.querySelector("#time");
const timeSlots = document.querySelectorAll(".time-slot.available");
const bookingNote = document.querySelector("#booking-note");

const whatsappNumber = "5583993489774";
const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .split("T")[0];

dateInput.min = localDate;

timeSlots.forEach((slot) => {
  slot.addEventListener("click", () => {
    timeSlots.forEach((availableSlot) => {
      availableSlot.classList.remove("selected");
      availableSlot.removeAttribute("aria-pressed");
    });

    slot.classList.add("selected");
    slot.setAttribute("aria-pressed", "true");
    timeInput.value = slot.dataset.time;
    bookingNote.textContent =
      "Horário selecionado. Complete seus dados para continuar.";
  });
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!timeInput.value) {
    bookingNote.textContent = "Escolha um horário disponível para continuar.";
    return;
  }

  const formData = new FormData(bookingForm);
  const service = formData.get("service");
  const date = new Date(`${formData.get("date")}T12:00:00`);
  const formattedDate = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const time = formData.get("time");
  const name = formData.get("name");
  const message = [
    "Olá, JS Barber! Gostaria de solicitar um agendamento.",
    "",
    `Nome: ${name}`,
    `Serviço: ${service}`,
    `Data: ${formattedDate}`,
    `Horário: ${time}`,
  ].join("\n");

  bookingNote.textContent = "Abrindo o WhatsApp para confirmar seu horário...";
  window.open(
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer",
  );
});
