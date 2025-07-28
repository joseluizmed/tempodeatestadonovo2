import React, { useState } from 'react';

// Type definitions for the File System Access API.
// This prevents TypeScript errors for `window.showSaveFilePicker`, which is not yet
// included in the standard TypeScript DOM library definitions.
interface SaveFilePickerOptions {
    suggestedName?: string;
    types?: {
        description?: string;
        accept?: Record<string, string[]>;
    }[];
}

interface FileSystemFileHandle {
    createWritable(): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream extends WritableStream {
    write(data: BlobPart): Promise<void>;
    close(): Promise<void>;
}

declare global {
    interface Window {
        showSaveFilePicker(options?: SaveFilePickerOptions): Promise<FileSystemFileHandle>;
    }
}

interface GeneratedOutputProps {
  content: {
    json: string;
    md?: string;
    mdFilename?: string;
    instructions?: string;
  };
  onBack: () => void;
}

type SaveStatus = 'idle' | 'saving' | 'success' | 'error' | 'cancelled';

interface FileSaveButtonProps {
    fileName: string;
    fileContent: string;
    mimeType: string;
    fileExtension: string;
    label: string;
}

const FileSaveButton: React.FC<FileSaveButtonProps> = ({ fileName, fileContent, mimeType, fileExtension, label }) => {
    const [status, setStatus] = useState<SaveStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSave = async () => {
        if (typeof window.showSaveFilePicker !== 'function') {
            setErrorMessage('Seu navegador não suporta esta funcionalidade. Tente usar o Chrome, Edge ou outro navegador compatível.');
            setStatus('error');
            return;
        }
        
        setStatus('saving');
        setErrorMessage('');
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: fileName,
                types: [{
                    description: `Arquivo ${fileName.split('.').pop()?.toUpperCase()}`,
                    accept: { [mimeType]: [`.${fileExtension}`] },
                }],
            });
            const writable = await handle.createWritable();
            await writable.write(fileContent);
            await writable.close();
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err: any) {
            if (err.name === 'AbortError') {
                setStatus('cancelled');
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                console.error('Erro ao salvar arquivo:', err);
                setErrorMessage(err.message || 'Ocorreu um erro desconhecido.');
                setStatus('error');
            }
        }
    };

    const getStatusInfo = () => {
        switch(status) {
            case 'saving':
                return <span className="text-sm text-blue-600 ml-3">Salvando...</span>;
            case 'success':
                return <span className="text-sm text-green-600 ml-3">Arquivo salvo com sucesso!</span>;
            case 'error':
                return <span className="text-sm text-red-600 ml-3">Erro: {errorMessage}</span>;
            case 'cancelled':
                 return <span className="text-sm text-yellow-600 ml-3">Operação cancelada.</span>;
            default:
                return null;
        }
    }

    return (
        <div className="flex items-center">
            <button
                onClick={handleSave}
                disabled={status === 'saving'}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
                {label}
            </button>
            {getStatusInfo()}
        </div>
    );
};

const GeneratedOutput: React.FC<GeneratedOutputProps> = ({ content, onBack }) => {
  return (
    <div className="bg-white p-8 shadow-lg rounded-lg border border-green-300 space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-700">Ação Necessária: Salve os Arquivos</h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Seu artigo foi processado. Use os botões abaixo para salvar os arquivos gerados diretamente no seu computador. Salve-os na pasta <strong>`public/artigos/`</strong> do seu projeto.
        </p>
      </div>

      {/* JSON Save */}
      <div className="space-y-3 p-4 border rounded-lg">
        <h3 className="font-semibold text-gray-800">1. Salve o arquivo de índice:</h3>
        <p className="text-sm text-gray-500">Isso atualizará a lista de todos os artigos.</p>
        <FileSaveButton
            label="Salvar public/artigos/index.json"
            fileName="index.json"
            fileContent={content.json}
            mimeType="application/json"
            fileExtension="json"
        />
      </div>

      {/* Markdown Save or Deletion Instruction */}
      {content.md && content.mdFilename && (
         <div className="space-y-3 p-4 border rounded-lg">
            <h3 className="font-semibold text-gray-800">2. Salve o arquivo do artigo:</h3>
            <p className="text-sm text-gray-500">Isso criará ou atualizará o arquivo de conteúdo do artigo.</p>
             <FileSaveButton
                label={`Salvar ${content.mdFilename.replace('public/artigos/', '')}`}
                fileName={content.mdFilename.split('/').pop() || 'artigo.md'}
                fileContent={content.md}
                mimeType="text/markdown"
                fileExtension="md"
            />
        </div>
      )}
      
      {content.instructions && (
        <div className="space-y-2 p-4 border border-red-200 bg-red-50 rounded-lg">
            <h3 className="font-semibold text-red-700">2. Ação de Exclusão Manual:</h3>
            <div className="text-red-800">
                <p>O salvamento automático não pode excluir arquivos. Por favor, exclua o seguinte arquivo manualmente do seu projeto:</p>
                <p className="font-mono bg-red-100 p-2 rounded mt-2 text-sm">{content.instructions.replace('Agora, exclua manualmente o arquivo: ', '')}</p>
            </div>
        </div>
      )}

      <div className="text-center pt-6 border-t">
        <p className="text-sm text-gray-500 mb-4">Após salvar todos os arquivos necessários, você pode voltar para a lista.</p>
        <button
          onClick={onBack}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow-md"
        >
          Concluído, Voltar à Lista
        </button>
      </div>
    </div>
  );
};

export default GeneratedOutput;