document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('orderForm');
  const messageEl = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');

  function showMessage(text, type){
    messageEl.textContent = text;
    messageEl.classList.remove('success','error');
    if(type) messageEl.classList.add(type);
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    showMessage('','');

    const name = (form.querySelector('[name="fullName"]').value || '').trim();
    const phone = (form.querySelector('[name="phone"]').value || '').trim();
    const address = (form.querySelector('[name="addressCity"]').value || '').trim();
    const phoneRegex = /^[0-9 +()\-]{6,20}$/;

    if(!name){
      showMessage('Veuillez entrer votre nom.','error');
      return;
    }

    if(!phoneRegex.test(phone)){
      showMessage('Veuillez entrer un numéro de téléphone valide.','error');
      return;
    }

    if(!address){
      showMessage('Veuillez entrer votre adresse.','error');
      return;
    }

    let order = [];
    try{
      order = JSON.parse(document.getElementById('orderItems').value);
    } catch(err){
      order = [];
    }

    if(order.length === 0){
      showMessage('Aucun produit sélectionné.','error');
      return;
    }

    const summary = order.map(it => `${it.name} × ${it.quantity} (Rs ${it.price})`).join('\n');
    const total = order.reduce((sum,it)=> sum + it.quantity * it.price, 0);

    // 🔹 Nouveau message incluant l'adresse
    const messageText = 
`Commande de ${name}
Téléphone: ${phone}
Adresse: ${address}

Produits:
${summary}

Total: Rs ${total}`;

    const whatsappNumber = '212630570771'; // ✅ format correct, sans + ni 00

    // Ouvre WhatsApp Web / App mobile
    window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;

    showMessage('Commande prête à être envoyée sur WhatsApp.','success');
    form.reset();
  });
});
