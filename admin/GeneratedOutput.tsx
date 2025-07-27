import React from 'react';

interface GeneratedOutputProps {
  content: {
    json: string;
    md?: string;
    mdFilename?: string;
    instructions?: string;
  };
  onBack: () => void;
}

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold py-1 px-2 rounded"
    >
      {copied ? 'Copiado!' : 'Copiar'}
    </button>
  );
};

const GeneratedOutput: React.FC<GeneratedOutputProps> = ({ content, onBack }) => {
  return (
    <div className="bg-white p-8 shadow-lg rounded-lg border border-green-300 space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-700">Ação Necessária: Atualize os Arquivos Manualmente</h2>
        <p className="mt-2 text-gray-600">
          Seu artigo foi processado. Agora, copie o conteúdo abaixo e cole nos arquivos correspondentes do seu projeto.
        </p>
      </div>

      {/* JSON Output */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800">1. Atualize o arquivo de índice:</h3>
        <p className="text-sm text-gray-500 font-mono bg-gray-100 p-2 rounded">public/artigos/index.json</p>
        <div className="relative">
          <textarea
            readOnly
            value={content.json}
            rows={10}
            className="w-full p-3 font-mono text-sm bg-gray-50 border border-gray-300 rounded-md"
          />
          <CopyButton textToCopy={content.json} />
        </div>
      </div>

      {/* Markdown Output or Deletion Instruction */}
      {content.md && content.mdFilename && (
         <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">2. Crie ou atualize o arquivo do artigo:</h3>
            <p className="text-sm text-gray-500 font-mono bg-gray-100 p-2 rounded">{content.mdFilename}</p>
            <div className="relative">
            <textarea
                readOnly
                value={content.md}
                rows={15}
                className="w-full p-3 font-mono text-sm bg-gray-50 border border-gray-300 rounded-md"
            />
            <CopyButton textToCopy={content.md} />
            </div>
        </div>
      )}
      
      {content.instructions && (
        <div className="space-y-2">
            <h3 className="font-semibold text-red-700">2. Ação de Exclusão:</h3>
            <div className="bg-red-50 border border-red-300 p-4 rounded-md text-red-800">
                <p>{content.instructions}</p>
            </div>
        </div>
      )}

      <div className="text-center pt-6 border-t">
        <button
          onClick={onBack}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
        >
          Concluído, Voltar à Lista
        </button>
      </div>
    </div>
  );
};

export default GeneratedOutput;
