const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // dossier public pour HTML/CSS/JS

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bazar.andalos@gmail.com',
    pass: 'VOTRE_APP_PASSWORD' // App password Gmail
  }
});

app.post('/send-order', async (req, res) => {
  const { fullName, phone, addressCity, product, orderItems } = req.body;

  let orderText = '';
  let total = 0;

  try {
    const items = JSON.parse(orderItems);
    orderText = items.map(it => `${it.name} × ${it.quantity} (Rs ${it.price})`).join('\n');
    total = items.reduce((sum,it)=> sum + it.price*it.quantity,0);
  } catch(e) {
    orderText = product || '';
  }

  const mailOptions = {
    from: '"Bazar Andalos" <bazar.andalos@gmail.com>',
    to: 'raoui.med.amine@gmail.com',
    subject: `Nouvelle commande de ${fullName}`,
    text: `Nom: ${fullName}\nTéléphone: ${phone}\nAdresse: ${addressCity}\n\nProduits:\n${orderText}\n\nTotal: Rs ${total}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch(err) {
    console.error('SMTP error:', err);
    res.json({ success: false, error: err.message });
  }
});

app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname,'public','index.html'));
});

app.listen(3000, () => console.log('Server running on port 3000'));
