import { GoogleGenAI } from "@google/genai";
import { marked } from "marked";

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    if (!process.env.API_KEY) {
      console.error("API Key not found.");
      throw new Error("A configuração do servidor está incompleta. A chave da API não foi encontrada.");
    }
    
    const { question, contextTitle } = JSON.parse(event.body);

    if (!question) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Nenhuma pergunta foi fornecida.' }),
      };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `Você é um assistente virtual especialista em perícia médica e benefícios do INSS, baseado nos conhecimentos e experiência do Dr. José Luiz de Souza Neto. Seu propósito é fornecer informações claras, objetivas e úteis para trabalhadores e segurados. Responda exclusivamente em português do Brasil. Formate suas respostas usando Markdown. Seja conciso e direto. Nunca se apresente, apenas forneça a resposta.`;
    
    let userPrompt = question;
    if (contextTitle) {
      userPrompt = `Dentro do contexto do artigo "${contextTitle}", responda à seguinte pergunta: "${question}"`;
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.5,
            thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for lower latency
        },
    });
    
    // Check for blocked prompts before trying to access the text.
    if (response.promptFeedback?.blockReason) {
      const reason = response.promptFeedback.blockReason;
      console.warn(`Prompt blocked due to ${reason}`, response.promptFeedback.safetyRatings);
      throw new Error(`Sua pergunta foi bloqueada por motivos de segurança (${reason}). Por favor, reformule sua pergunta.`);
    }

    const rawAnswer = response.text;
    if (!rawAnswer) {
      throw new Error("A IA retornou uma resposta vazia. Isso pode ser devido a filtros de segurança ou um problema com a pergunta.");
    }
    
    const htmlAnswer = await marked.parse(rawAnswer, { async: true, gfm: true });
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: htmlAnswer }),
    };

  } catch (error) {
    console.error('Error in ask-ai function:', error);
    // Return the actual error message for better frontend feedback.
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro ao processar sua pergunta. Tente novamente.';
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};