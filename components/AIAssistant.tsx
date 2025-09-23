import React, { useState, useCallback, useEffect } from 'react';
import { marked } from 'marked';

interface AIAssistantProps {
  contextTitle?: string;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const AIAssistant: React.FC<AIAssistantProps> = ({ contextTitle }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastQuestion, setLastQuestion] = useState('');
  const [renderedAnswer, setRenderedAnswer] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      if (answer) {
        marked.parse(answer, { async: true, gfm: true }).then(html => setRenderedAnswer(html));
      } else {
        setRenderedAnswer('');
      }
    }, 100);
    return () => clearTimeout(handler);
  }, [answer]);

  const handleAsk = useCallback(async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setError('');
    setAnswer('');
    setLastQuestion(question);

    try {
      const response = await fetch('/.netlify/functions/ask-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, contextTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Ocorreu um erro no servidor: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("A resposta do servidor não continha dados para streaming.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep any partial line in the buffer

        for (const line of lines) {
          if (line.trim() === '') continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.chunk) {
              setAnswer(prev => prev + parsed.chunk);
            }
          } catch (e) {
            console.warn("Could not parse JSON line from stream:", line);
          }
        }
      }

    } catch (e: any) {
      console.error(e);
      let errorMessage = "Desculpe, não foi possível processar sua pergunta no momento. Tente novamente mais tarde.";
      if (e.message) {
        errorMessage = e.message;
      }
      setError(errorMessage);
      setAnswer('');
    } finally {
      setIsLoading(false);
      setQuestion('');
    }
  }, [question, contextTitle]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk();
  };

  return (
    <div className="ai-assistant-container">
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Digite sua pergunta aqui..."
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
                aria-label="Caixa de texto para pergunta"
            />
            <button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:bg-blue-400 disabled:cursor-not-allowed"
                aria-live="polite"
            >
                {isLoading ? <LoadingSpinner /> : 'Enviar Pergunta'}
            </button>
        </form>

        {error && <p className="text-red-600 bg-red-100 p-3 mt-4 rounded-md text-sm">{error}</p>}

        {(isLoading || answer) && (
            <div className="mt-6 space-y-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <p className="font-semibold text-gray-700">Sua pergunta:</p>
                    <p className="text-gray-600 mt-1">{lastQuestion}</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
                    <p className="font-semibold text-blue-800">Resposta do Assistente:</p>
                    {isLoading && !answer && (
                        <div className="flex items-center space-x-2 text-gray-500 mt-2">
                            <div className="animate-spin h-5 w-5 border-b-2 border-blue-600 rounded-full"></div>
                            <span>Analisando sua pergunta...</span>
                        </div>
                    )}
                    <div 
                        className="prose prose-sm max-w-none mt-2 text-gray-800"
                        dangerouslySetInnerHTML={{ __html: renderedAnswer }}
                    />
                </div>
            </div>
        )}
    </div>
  );
};

export default AIAssistant;
