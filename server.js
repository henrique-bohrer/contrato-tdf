const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const dayjs = require('dayjs');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// =================================================================================================
// TODO: User Configuration
// You need to configure your Discord Webhook URL below.
// See the README.md for instructions on how to create a webhook URL.
// =================================================================================================
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1402646899437338675/YPzHSvztaMXLjgaW2af6bBivUPwI1YtH-nazzeDWw5Ojpcn83zTjNc3wtPKtq019c7Ty';


app.post('/send-notification', async (req, res) => {
  if (DISCORD_WEBHOOK_URL === 'YOUR_DISCORD_WEBHOOK_URL_HERE' || DISCORD_WEBHOOK_URL === '') {
    const errorMessage = 'Discord Webhook URL is not configured in server.js';
    console.error(errorMessage);
    return res.status(500).send({ message: errorMessage });
  }

  const { nome_responsavel, nome_atleta, consultor } = req.body;

  if (!nome_responsavel || !nome_atleta || !consultor) {
    return res.status(400).send({ message: 'Informações obrigatórias estão faltando.' });
  }

  const now = dayjs().format('DD/MM/YYYY HH:mm');

  // Format the message using Discord's markdown for better readability
  const messageContent = `🔔 **Nova Assinatura de Contrato!** 🔔\n\n> **Responsável:** ${nome_responsavel}\n> **Atleta:** ${nome_atleta}\n> **Consultor:** ${consultor}\n> **Data/Hora:** ${now}`;

  const data = {
    content: messageContent,
    username: "Notificador de Contratos TDF" // This will be the name of the bot in Discord
  };

  try {
    await axios.post(DISCORD_WEBHOOK_URL, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Notification sent successfully to Discord.');
    res.status(200).send({ message: 'Notificação enviada com sucesso.' });
  } catch (error) {
    console.error('Error sending notification to Discord:', error.response ? error.response.data : error.message);
    res.status(500).send({ message: 'Falha ao enviar notificação para o Discord.', error: error.response ? error.response.data : error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log('Servidor configurado para enviar notificações para o Discord.');
});
