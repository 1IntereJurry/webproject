// --- Mobile Menü Toggle ---
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !expanded);
      mobileMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (
        !menuToggle.contains(e.target) &&
        !mobileMenu.contains(e.target) &&
        mobileMenu.classList.contains('active')
      ) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('active');
      }
    });
  }

  // --- Counter-Buttons & Preisvorschau (nur falls vorhanden) ---
  if (document.querySelectorAll('.counter').length > 0) {
    document.querySelectorAll('.counter').forEach(group => {
      const minus = group.querySelector('.minus');
      const plus = group.querySelector('.plus');
      const input = group.querySelector('input');

      minus.addEventListener('click', () => {
        const val = parseInt(input.value) || 0;
        if (val > 0) input.value = val - 1;
        updateGesamtpreis();
      });

      plus.addEventListener('click', () => {
        const val = parseInt(input.value) || 0;
        input.value = val + 1;
        updateGesamtpreis();
      });

      input.addEventListener('change', updateGesamtpreis);
    });

    function updateGesamtpreis() {
      const kaiser = parseInt(document.querySelector('input[name="kaiser"]')?.value) || 0;
      const vollkorn = parseInt(document.querySelector('input[name="vollkorn"]')?.value) || 0;
      const schoko = parseInt(document.querySelector('input[name="schoko"]')?.value) || 0;
      const preis = (kaiser * 0.65) + (vollkorn * 0.85) + (schoko * 1.10);
      const vorschau = document.getElementById('Preisvorschau') || document.getElementById('preisvorschau');
      if (vorschau) vorschau.textContent = `🧾 Gesamt: €${preis.toFixed(2)}`;
    }
    updateGesamtpreis();
  }

  // --- Lieferoptionen (nur falls vorhanden) ---
  const einmaligCheckbox = document.getElementById('einmalig');
  const zeitraumFeld = document.getElementById('zeitraum');
  const startDatum = document.getElementById('startdate');
  const endDatum = document.getElementById('enddate');
  if (einmaligCheckbox && zeitraumFeld && startDatum && endDatum) {
    einmaligCheckbox.addEventListener('change', () => {
      if (einmaligCheckbox.checked) {
        zeitraumFeld.style.display = 'none';
        startDatum.removeAttribute('required');
        endDatum.removeAttribute('required');
      } else {
        zeitraumFeld.style.display = 'block';
        startDatum.setAttribute('required', 'true');
        endDatum.setAttribute('required', 'true');
      }
    });
  }

  // --- Formular-Validierung (nur falls vorhanden) ---
  const bestellformular = document.getElementById('bestellformular');
  if (bestellformular) {
    bestellformular.addEventListener('submit', function(e) {
      // Mindestmenge prüfen
      const total = ['kaiser', 'vollkorn', 'schoko']
        .map(name => parseInt(document.querySelector(`input[name="${name}"]`)?.value) || 0)
        .reduce((a, b) => a + b, 0);
      if (total < 1) {
        e.preventDefault();
        alert("Du musst mindestens 1 Brötchen auswählen.");
        return;
      }

      // Zeitraum-Prüfung (nur wenn Abo gewählt)
      if (einmaligCheckbox && !einmaligCheckbox.checked) {
        const start = startDatum.value;
        const ende = endDatum.value;
        const today = new Date().toISOString().split('T')[0];

        if (start < today) {
          alert('Der Starttermin darf nicht in der Vergangenheit liegen.');
          e.preventDefault();
          return;
        }
        if (ende <= start) {
          alert('Der Endtermin muss nach dem Starttermin liegen.');
          e.preventDefault();
          return;
        }
      }
    });
  }
});