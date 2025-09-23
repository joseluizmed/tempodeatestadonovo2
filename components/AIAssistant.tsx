import React, { useState, useCallback } from 'react';

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

  const handleAsk = useCallback(async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setError('');
    setAnswer('');
    setLastQuestion(question);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25-second client-side timeout

    try {
      const response = await fetch('/.netlify/functions/ask-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, contextTitle }),
        signal: controller.signal, // Pass the abort signal to the fetch request
      });

      clearTimeout(timeoutId); // The request finished, so we clear the timeout

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocorreu um erro na comunicação com o servidor.');
      }

      setAnswer(data.answer);

    } catch (e: any) {
      clearTimeout(timeoutId); // Ensure timeout is cleared on error as well
      console.error(e);
      let errorMessage = "Desculpe, não foi possível processar sua pergunta no momento. Tente novamente mais tarde.";

      if (e.name === 'AbortError') {
        errorMessage = "A requisição demorou muito para responder (timeout). Por favor, tente novamente.";
      } else if (e.message && e.message.includes('Failed to fetch')) {
        errorMessage = "Ocorreu um erro de comunicação com o servidor. Isso pode ser devido a um problema de rede ou o serviço pode estar temporariamente indisponível.";
      } else if (e.message) {
        errorMessage = e.message;
      }
      setError(errorMessage);
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
                    {isLoading ? (
                        <div className="flex items-center space-x-2 text-gray-500 mt-2">
                            <div className="animate-spin h-5 w-5 border-b-2 border-blue-600 rounded-full"></div>
                            <span>Analisando sua pergunta...</span>
                        </div>
                    ) : (
                        <div 
                            className="prose prose-sm max-w-none mt-2 text-gray-800"
                            dangerouslySetInnerHTML={{ __html: answer }}
                        />
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default AIAssistant;