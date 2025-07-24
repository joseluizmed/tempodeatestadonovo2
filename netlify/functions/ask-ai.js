
import { GoogleGenAI } from "@google/genai";
import { marked } from "marked";

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
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
    
    let prompt = `Pergunta do usuário: "${question}"`;
    if (contextTitle) {
      prompt = `Com base no contexto do artigo "${contextTitle}", responda à seguinte pergunta do usuário: "${question}"`;
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.5,
        },
    });
    
    const rawAnswer = response.text;
    const htmlAnswer = await marked.parse(rawAnswer, { async: true, gfm: true });
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: htmlAnswer }),
    };

  } catch (error) {
    console.error('Error in ask-ai function:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Ocorreu um erro ao processar sua pergunta. Tente novamente.' }),
    };
  }
};
