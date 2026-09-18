const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');
const reservationForm = document.querySelector('#reservation-form');
const formMessage = document.querySelector('#form-message');

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  mainNav?.classList.toggle('is-open', !isOpen);
});

mainNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('is-open');
  });
});

reservationForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  formMessage.textContent = 'Gracias. Te escribiremos por WhatsApp para confirmar tu mesa.';
  reservationForm.reset();
});