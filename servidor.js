// 1. Importar as ferramentas que instalámos
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

// 2. Configurar o servidor
const app = express();
app.use(cors()); // Permite que o nosso site (frontend) aceda a este servidor
app.use(express.json()); // Permite que o servidor entenda os dados JSON que o site vai enviar

// 3. Configurar o serviço de e-mail
// CUIDADO: Use um e-mail de teste ou crie uma "Senha de app" no seu Gmail.
// NUNCA coloque a sua senha principal diretamente no código em projetos reais.
const transporter = nodemailer.createTransport({
    service: 'gmail', // Pode usar outros serviços como Outlook, etc.
    auth: {
        user: 'henrique300415@gmail.com', // SUBSTITUA PELO SEU E-MAIL
        pass: 'Hb5207418@25'       // SUBSTITUA PELA SUA SENHA (ou senha de app)
    }
});

// 4. Criar a "rota" que vai receber os dados e enviar o e-mail
app.post('/enviar-notificacao', (req, res) => {
    console.log('Dados recebidos:', req.body);

    const dados = req.body;

    // Monta o conteúdo do e-mail com os dados recebidos do formulário
    const mailOptions = {
        from: 'henrique300415@gmail.com',     // O seu e-mail
        to: 'henrique300415@gmail.com', // SUBSTITUA pelo e-mail que deve receber a notificação
        subject: `Novo Contrato Assinado - Atleta: ${dados.nomeAtleta}`,
        html: `
            <h1>Novo Contrato Assinado no Site!</h1>
            <p>Um novo termo de compromisso foi preenchido e assinado.</p>
            <h2>Detalhes do Contrato:</h2>
            <ul>
                <li><strong>Responsável:</strong> ${dados.nomeResponsavel}</li>
                <li><strong>CPF do Responsável:</strong> ${dados.cpf}</li>
                <li><strong>Telefone:</strong> ${dados.telefone}</li>
                <li><strong>Nome do Atleta:</strong> ${dados.nomeAtleta}</li>
                <li><strong>Data de Nasc. do Atleta:</strong> ${dados.dataFormatada}</li>
                <li><strong>Consultor da Vaga:</strong> ${dados.nomeConsultor}</li>
            </ul>
        `
    };

    // 5. Envia o e-mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar e-mail:', error);
            return res.status(500).send('Erro ao enviar e-mail.');
        }
        console.log('E-mail enviado com sucesso:', info.response);
        res.status(200).send('Notificação enviada com sucesso!');
    });
});

// 6. Iniciar o servidor para que ele fique "à escuta" por pedidos
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor de notificações a correr na porta ${PORT}`);
});