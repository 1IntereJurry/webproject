document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile menu toggle ---
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

  // --- Counter buttons & price preview ---
  if (document.querySelectorAll('.counter').length > 0) {
    document.querySelectorAll('.counter').forEach(group => {
      const minus = group.querySelector('.minus');
      const plus = group.querySelector('.plus');
      const input = group.querySelector('input');

      minus.addEventListener('click', () => {
        const val = parseInt(input.value) || 0;
        if (val > 0) input.value = val - 1;
        updatePricePreview();
      });

      plus.addEventListener('click', () => {
        const val = parseInt(input.value) || 0;
        input.value = val + 1;
        updatePricePreview();
      });

      input.addEventListener('change', updatePricePreview);
    });

    function updatePricePreview() {
      const kaiser = parseInt(document.querySelector('input[name="kaiser"]')?.value) || 0;
      const vollkorn = parseInt(document.querySelector('input[name="vollkorn"]')?.value) || 0;
      const schoko = parseInt(document.querySelector('input[name="schoko"]')?.value) || 0;
      const price = (kaiser * 0.65) + (vollkorn * 0.85) + (schoko * 1.10);
      const preview = document.getElementById('pricePreview');
      if (preview) preview.textContent = `🧾 Total: €${price.toFixed(2)}`;
    }
    updatePricePreview();
  }

  // --- Delivery options ---
  const oneTimeCheckbox = document.getElementById('oneTime');
  const periodField = document.getElementById('period');
  const startDate = document.getElementById('startDate');
  const endDate = document.getElementById('endDate');
  if (oneTimeCheckbox && periodField && startDate && endDate) {
    oneTimeCheckbox.addEventListener('change', () => {
      if (oneTimeCheckbox.checked) {
        periodField.style.display = 'none';
        startDate.removeAttribute('required');
        endDate.removeAttribute('required');
      } else {
        periodField.style.display = 'block';
        startDate.setAttribute('required', 'true');
        endDate.setAttribute('required', 'true');
      }
    });
  }

  // --- Form validation ---
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', function(e) {
      // Minimum quantity check
      const total = ['kaiser', 'vollkorn', 'schoko']
        .map(name => parseInt(document.querySelector(`input[name="${name}"]`)?.value) || 0)
        .reduce((a, b) => a + b, 0);
      if (total < 1) {
        e.preventDefault();
        alert("You must select at least 1 bread roll.");
        return;
      }

      // Date range check (only if subscription)
      if (oneTimeCheckbox && !oneTimeCheckbox.checked) {
        const start = startDate.value;
        const end = endDate.value;
        const today = new Date().toISOString().split('T')[0];

        if (start < today) {
          alert('The start date cannot be in the past.');
          e.preventDefault();
          return;
        }
        if (end <= start) {
          alert('The end date must be after the start date.');
          e.preventDefault();
          return;
        }
      }
    });
  }

  // --- Auth Card Switcher (if used on login.html) ---
  const authCard = document.getElementById('auth-card');
  const switchToRegister = document.getElementById('switch-to-register');
  const switchToLogin = document.getElementById('switch-to-login');

  if (authCard && switchToRegister && switchToLogin) {
    switchToRegister.addEventListener('click', () => {
      authCard.classList.add('slide-register');
    });
    switchToLogin.addEventListener('click', () => {
      authCard.classList.remove('slide-register');
    });
  }
});