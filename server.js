require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.post('/analyseer', async (req, res) => {
  const { email } = req.body;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Je bent een medewerker bij een transportbedrijf. Analyseer deze e-mail en geef het volgende terug:

CATEGORIE: (kies uit: Klacht, Leveringsvraag, Prijsaanvraag, Vertraging, Schade, Algemeen)
URGENTIE: (kies uit: Hoog, Normaal, Laag)
SAMENVATTING: (één zin wat de klant wil)
CONCEPT-ANTWOORD: (professioneel antwoord in dezelfde taal als de e-mail)

E-mail:
${email}`
      }]
    })
  });

  const data = await response.json();
  res.json(data);
});

app.listen(3001, () => {
  console.log('Server draait op http://localhost:3001');
});