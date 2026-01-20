/*document.cookie = "orderId="+0 +",counter="+0

let httpRequest = new XMLHttpRequest(),
jsonArray,
method = "GET",
jsonRequestURL = "https://5d76bf96515d1a0014085cf9.mockapi.io/order";

httpRequest.open(method, jsonRequestURL, true);
httpRequest.onreadystatechange = function()
{
    if(httpRequest.readyState == 4 && httpRequest.status == 200)
    {
        // convert JSON into JavaScript object
        jsonArray = JSON.parse(httpRequest.responseText)
        console.log(jsonArray)    
        jsonArray.push(
            {
                "id": (jsonArray.length)+1, "amount": 200,"product":["userOrder"]
            })

        // send with new request the updated JSON file to the server:
        httpRequest.open("POST", jsonRequestURL, true)
        httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        httpRequest.send(jsonArray)
    }
}
httpRequest.send(null);
*/

document.addEventListener('DOMContentLoaded', function () {

  const showBtn = document.getElementById('showOrderFormBtn');
  const form = document.getElementById('orderForm');

  showBtn.addEventListener('click', function () {
    form.style.display = 'block';
    showBtn.style.display = 'none'; // يخبي الزر من بعد
  });

  // ====== الكود ديالك القديم ======
  const messageEl = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');

  function showMessage(text, type){
    messageEl.textContent = text;
    messageEl.classList.remove('success','error');
    if(type) messageEl.classList.add(type);
  }

  form.addEventListener('submit', async function(e){
    e.preventDefault();

    const fullName = form.querySelector('[name="fullName"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const addressCity = form.querySelector('[name="addressCity"]').value.trim();
    const product = form.querySelector('[name="product"]').value;
    const orderItems = form.querySelector('[name="orderItems"]').value;

    if(!fullName || !phone || !product){
      showMessage('Veuillez remplir tous les champs obligatoires.','error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi...';

    try {
      const res = await fetch('/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, addressCity, product, orderItems })
      });

      const result = await res.json();

      if(result.success){
        showMessage('Merci, votre commande a été envoyée.','success');
        form.reset();
        window.location.href = '/orderPlaced.html'; // 🔥 تحويل للنجاح
      } else {
        showMessage('Erreur: ' + result.error,'error');
      }

    } catch(err){
      showMessage('Erreur serveur ou réseau.','error');
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Commander';
  });
});
