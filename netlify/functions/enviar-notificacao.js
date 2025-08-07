// Ficheiro: /netlify/functions/enviar-notificacao.js

const fetch = require('node-fetch');

// O URL do Webhook será configurado nas variáveis de ambiente da Netlify, por segurança
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const dados = JSON.parse(event.body);
    const dataFormatada = dados.nascimento_atleta.split('-').reverse().join('/');

    // --- AJUSTE DE FUSO HORÁRIO PARA SÃO PAULO ---
    // Opções para formatar a data e hora especificando o fuso horário
    const options = {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    const dataHoraSaoPaulo = new Date().toLocaleString('pt-BR', options);
    // --- FIM DO AJUSTE ---

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
        // Usamos a nova variável com a hora correta
        footer: { text: `Contrato assinado em ${dataHoraSaoPaulo}` }
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