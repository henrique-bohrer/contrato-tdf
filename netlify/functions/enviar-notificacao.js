// Ficheiro: /netlify/functions/enviar-notificacao.js

// Usamos uma biblioteca simples para enviar o pedido
const fetch = require('node-fetch');

// O URL do Webhook será configurado nas variáveis de ambiente da Netlify, por segurança
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

exports.handler = async (event) => {
  // A função só aceita pedidos do tipo POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const dados = JSON.parse(event.body);
    const dataFormatada = dados.nascimento_atleta.split('-').reverse().join('/');

    const discordMessage = {
      embeds: [{
        title: "📄 Novo Contrato Assinado!",
        color: 0xFEEB00, // Amarelo
        fields: [
          { name: "Responsável", value: dados.nome_responsavel || 'N/A', inline: true },
          { name: "Atleta", value: dados.nome_atleta || 'N/A', inline: true },
          { name: "Consultor", value: dados.consultor || 'N/A', inline: true },
          { name: "CPF", value: dados.cpf || 'N/A', inline: true },
          { name: "Telefone", value: dados.telefone || 'N/A', inline: true },
          { name: "Data de Nasc.", value: dataFormatada || 'N/A', inline: true },
        ],
        footer: { text: `Contrato assinado em ${new Date().toLocaleString('pt-BR')}` }
      }]
    };

    // Envia a notificação para o Discord
    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordMessage)
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Notificação enviada com sucesso!" })
    };

  } catch (error) {
    console.error('Erro na função Netlify:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Falha ao processar a notificação.' })
    };
  }
};