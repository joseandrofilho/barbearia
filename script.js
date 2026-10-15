const header = document.querySelector("#header");
const whatsappFloat = document.querySelector("#whatsapp-float");
const menuMobile = document.querySelector(".menu-mobile");
const bookingForm = document.querySelector("#booking-form");
const dateInput = document.querySelector("#date");
const timeInput = document.querySelector("#time");
const timeSlots = document.querySelectorAll(".time-slot.available");
const bookingNote = document.querySelector("#booking-note");

const whatsappNumber = "5583993489774";

// Header translúcido e botão flutuante ao rolar
function updateOnScroll() {
  const scrolled = window.scrollY > 40;
  header.classList.toggle("is-scrolled", scrolled);
  whatsappFloat.classList.toggle(
    "is-visible",
    window.scrollY > window.innerHeight * 0.8,
  );
}

updateOnScroll();
window.addEventListener("scroll", updateOnScroll, { passive: true });

// Fecha o menu mobile ao escolher um link
menuMobile.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => menuMobile.removeAttribute("open"));
});

// Destaca o link da seção visível
const navLinks = document.querySelectorAll(".nav-desktop a");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === `#${entry.target.id}`,
        );
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" },
);

document
  .querySelectorAll("main section[id]")
  .forEach((section) => sectionObserver.observe(section));

// Animação de entrada dos elementos
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// Ano no rodapé
document.querySelector("#ano").textContent = new Date().getFullYear();

// Agendamento
const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .split("T")[0];

dateInput.min = localDate;

// "Agendar" nos cards pré-seleciona o serviço
document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    const option = bookingForm.querySelector(
      `input[name="service"][value="${link.dataset.service}"]`,
    );
    if (option) option.checked = true;
  });
});

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
