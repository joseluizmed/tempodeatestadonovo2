import { GoogleGenAI } from "@google/genai";

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

    const geminiStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.5,
            thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for lower latency
        },
    });
    
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of geminiStream) {
            if (chunk.promptFeedback?.blockReason) {
              const reason = chunk.promptFeedback.blockReason;
              console.warn(`Prompt blocked due to ${reason}`, chunk.promptFeedback.safetyRatings);
              const errorPayload = JSON.stringify({ error: `Sua pergunta foi bloqueada por motivos de segurança (${reason}). Por favor, reformule sua pergunta.` });
              controller.enqueue(encoder.encode(errorPayload + '\n'));
              controller.close();
              return;
            }

            const text = chunk.text;
            if (text) {
              const payload = JSON.stringify({ chunk: text });
              controller.enqueue(encoder.encode(payload + '\n'));
            }
          }
          controller.close();
        } catch (error) {
            console.error("Error while streaming from Gemini:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during streaming.";
            const errorPayload = JSON.stringify({ error: errorMessage });
            controller.enqueue(encoder.encode(errorPayload + '\n'));
            controller.close();
        }
      }
    });

    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/octet-stream', // Use a generic stream type
        'Transfer-Encoding': 'chunked',
      },
      body: readableStream,
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
