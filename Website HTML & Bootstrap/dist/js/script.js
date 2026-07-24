document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (window.AOS) {
    window.AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out'
    });
  }
});
