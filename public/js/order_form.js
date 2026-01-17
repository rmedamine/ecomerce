document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('orderForm');
  const messageEl = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // récupérer les inputs
    const fullNameInput = form.querySelector('[name="fullName"]');
    const phoneInput = form.querySelector('[name="phone"]');
    const addressInput = form.querySelector('[name="addressCity"]');
    const productInput = form.querySelector('[name="product"]');
    const orderItemsInput = form.querySelector('[name="orderItems"]');

    if (!fullNameInput || !phoneInput || !addressInput || !productInput || !orderItemsInput) {
        console.log('fullNameInput:', fullNameInput);
console.log('phoneInput:', phoneInput);
console.log('addressInput:', addressInput);
console.log('productInput:', productInput);
console.log('orderItemsInput:', orderItemsInput);

      messageEl.textContent = 'Formulaire incomplet !';
      messageEl.style.color = 'red';
      return;
    }

    const data = {
      fullName: fullNameInput.value,
      phone: phoneInput.value,
      addressCity: addressInput.value,
      product: productInput.value,
      orderItems: orderItemsInput.value
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi...';
    messageEl.textContent = '';

    try {
      const res = await fetch('/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {

        messageEl.textContent = 'Commande envoyée avec succès !';
        messageEl.style.color = 'green';
        form.reset();
      } else {
        messageEl.textContent = 'Erreur: ' + result.error;
        messageEl.style.color = 'red';
      }
    } catch (err) {
      console.error('Fetch error:', err);
      messageEl.textContent = 'Erreur réseau ou serveur.';
      messageEl.style.color = 'red';
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Commander';
  });
});
