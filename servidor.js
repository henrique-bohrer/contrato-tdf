// Ficheiro: servidor.js

const express = require('express');
const cors = require('cors');
// Importamos a ferramenta da Twilio em vez do Nodemailer
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================================
// CONFIGURAÇÃO DA TWILIO
// ==========================================================
// Substitua pelos seus dados do painel da Twilio
const accountSid = 'AC51bea20b5af351e16804058c787bbc90'; // O seu Account SID
const authToken = 'e4223e7e2a16e758fe0c30f4cad5c84f';     // O seu Auth Token

// Cria o "cliente" da Twilio para enviar mensagens
const client = twilio(accountSid, authToken);

app.post('/enviar-notificacao', (req, res) => {
    console.log('Dados recebidos:', req.body);
    const dados = req.body;

    // Monta o texto da mensagem do WhatsApp
    const mensagem = `
*Novo Contrato TDF Assinado!* 📄⚽

Um novo termo foi preenchido com os seguintes dados:

*Responsável:* ${dados.nomeResponsavel}
*CPF:* ${dados.cpf}
*Telefone:* ${dados.telefone}
*Atleta:* ${dados.nomeAtleta}
*Nascimento:* ${dados.dataFormatada}
*Consultor:* ${dados.nomeConsultor}
    `;

    // Envia a mensagem de WhatsApp usando a Twilio
    client.messages
        .create({
            body: mensagem,
            // Este é o número do Sandbox da Twilio
            from: 'whatsapp:+14155238886',
            // SUBSTITUA pelo seu número de telefone verificado no Sandbox
            // Formato: whatsapp:+5541999998888 (com código do país e estado)
            to: 'whatsapp:+5549984287347'
        })
        .then(message => {
            console.log('Mensagem enviada com sucesso! SID:', message.sid);
            res.status(200).send('Notificação de WhatsApp enviada com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao enviar mensagem de WhatsApp:', error);
            res.status(500).send('Erro ao enviar notificação de WhatsApp.');
        });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor de notificações a correr na porta ${PORT}`);
});