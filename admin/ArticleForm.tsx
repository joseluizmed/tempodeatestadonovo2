import React, { useState, useEffect, useRef } from 'react';
import { ArticleDetails } from '../types';

interface ArticleFormProps {
  article: ArticleDetails;
  onSave: (article: ArticleDetails) => void;
  onCancel: () => void;
}

const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Normaliza para decompor caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
    .trim()
    .replace(/\s+/g, '-') // Substitui espaços por -
    .replace(/[^\w-]+/g, '') // Remove caracteres não-alfanuméricos (exceto -)
    .replace(/--+/g, '-'); // Remove hífens duplicados
};

// Moved InputField outside of ArticleForm to prevent it from being redefined on every render,
// which was causing the input to lose focus. It now receives its value and onChange handler via props.
const InputField: React.FC<{
  name: keyof ArticleDetails;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}> = ({ name, label, value, onChange }) => (
  <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
      />
  </div>
);

const ArticleForm: React.FC<ArticleFormProps> = ({ article, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ArticleDetails>(article);
  const isNew = !article.slug;

  const [imageRepoUrl, setImageRepoUrl] = useState(() => localStorage.getItem('imageRepoUrl') || 'https://unsplash.com/s/photos/médico');
  const [showRepoUrlInput, setShowRepoUrlInput] = useState(false);

  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);

  useEffect(() => {
    localStorage.setItem('imageRepoUrl', imageRepoUrl);
  }, [imageRepoUrl]);

  useEffect(() => {
    setFormData(article);
  }, [article]);

  useEffect(() => {
    const textarea = bodyTextareaRef.current;
    if (selection && textarea) {
      textarea.focus();
      textarea.setSelectionRange(selection.start, selection.end);
      setSelection(null); // Reset after applying
    }
  }, [selection, formData.body]); // Also depends on formData.body to ensure it runs after the state is set


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newFormData = {...prev, [name]: value};
        // Auto-update slug from title if it's a new article or slug is empty
        if (name === 'title' && (isNew || !prev.slug)) {
            newFormData.slug = slugify(value);
        }
        return newFormData;
    });
  };

  const applyMarkdownFormatting = (prefix: string, suffix: string, placeholder: string) => {
    const textarea = bodyTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let newBody;
    let newSelectionStart;
    let newSelectionEnd;

    if (selectedText) {
        const newText = `${prefix}${selectedText}${suffix}`;
        newBody = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
        newSelectionStart = start + newText.length;
        newSelectionEnd = newSelectionStart;
    } else {
        const newText = `${prefix}${placeholder}${suffix}`;
        newBody = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
        newSelectionStart = start + prefix.length;
        newSelectionEnd = start + prefix.length + placeholder.length;
    }

    setFormData(prev => ({ ...prev, body: newBody }));
    setSelection({ start: newSelectionStart, end: newSelectionEnd });
  };

  const handleAddList = () => {
    const textarea = bodyTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let newBody;
    let finalCursorPos;

    if (selectedText) {
        const lines = selectedText.split('\n');
        const listifiedText = lines.map(line => line.trim() === '' ? line : `- ${line}`).join('\n');
        newBody = textarea.value.substring(0, start) + listifiedText + textarea.value.substring(end);
        finalCursorPos = start + listifiedText.length;
    } else {
        const upToCursor = textarea.value.substring(0, start);
        const isStartOfLine = start === 0 || upToCursor.endsWith('\n');
        const textToInsert = isStartOfLine ? '- ' : '\n- ';
        newBody = upToCursor + textToInsert + textarea.value.substring(end);
        finalCursorPos = start + textToInsert.length;
    }
    
    setFormData(prev => ({ ...prev, body: newBody }));
    setSelection({ start: finalCursorPos, end: finalCursorPos });
  };
      
  const handleAddLink = () => {
    const url = prompt("Insira a URL para o link:", "https://");
    if (url) {
        applyMarkdownFormatting('[', `](${url})`, 'texto do link');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageRepoSearch = () => {
    window.open(imageRepoUrl, '_blank', 'noopener,noreferrer');
  };
  
  const MarkdownToolbar = () => (
    <div className="flex items-center flex-wrap gap-1 p-2 bg-gray-100 border border-b-0 border-gray-300 rounded-t-md">
        <button type="button" onClick={() => applyMarkdownFormatting('**', '**', 'texto em negrito')} className="px-3 py-1 text-sm font-bold rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" title="Negrito (Ctrl+B)">B</button>
        <button type="button" onClick={() => applyMarkdownFormatting('*', '*', 'texto em itálico')} className="px-3 py-1 text-sm italic rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" title="Itálico (Ctrl+I)">I</button>
        <button type="button" onClick={() => applyMarkdownFormatting('## ', '', 'Subtítulo')} className="px-3 py-1 text-sm font-semibold rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" title="Subtítulo">H2</button>
        <button type="button" onClick={handleAddLink} className="px-3 py-1 text-sm text-blue-600 underline rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" title="Link (Ctrl+K)">Link</button>
        <button type="button" onClick={() => applyMarkdownFormatting('> ', '', 'Citação')} className="px-3 py-1 text-sm text-gray-500 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" title="Bloco de Citação">“ ”</button>
        <button type="button" onClick={handleAddList} className="px-3 py-1 text-sm rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" title="Lista com Marcadores">• Lista</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-lg border border-gray-200 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{isNew ? 'Criar Novo Artigo' : `Editando: ${article.title}`}</h2>
      
      <InputField name="title" label="Título do Artigo" value={formData.title} onChange={handleChange} />
      
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug (URL amigável)</label>
        <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
            required
            readOnly={!isNew}
        />
        <p className="mt-2 text-xs text-gray-500">O slug é gerado automaticamente a partir do título e não pode ser alterado após a criação.</p>
      </div>

      <InputField name="author" label="Autor" value={formData.author} onChange={handleChange} />

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">URL da Imagem de Destaque</label>
        <div className="mt-1 flex rounded-md shadow-sm">
            <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                placeholder="https://exemplo.com/imagem.jpg"
            />
            <button
                type="button"
                onClick={() => setShowRepoUrlInput(!showRepoUrlInput)}
                className="inline-flex items-center px-3 border border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                title="Configurar repositório de imagens"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
            </button>
            <button
                type="button"
                onClick={handleImageRepoSearch}
                className="relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
                Buscar Imagem
            </button>
        </div>
        {showRepoUrlInput && (
            <div className="mt-2 transition-all duration-300">
                <label htmlFor="imageRepoUrl" className="block text-xs font-medium text-gray-600">URL do Repositório de Imagens (ex: Unsplash)</label>
                <input
                    type="text"
                    id="imageRepoUrl"
                    value={imageRepoUrl}
                    onChange={(e) => setImageRepoUrl(e.target.value)}
                    className="mt-1 block w-full px-2 py-1 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">Esta URL será aberta em uma nova aba. O valor é salvo localmente no seu navegador.</p>
            </div>
        )}
      </div>

      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Resumo (Summary)</label>
        <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
        />
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">Corpo do Artigo (em Markdown)</label>
        <MarkdownToolbar />
        <textarea
            id="body"
            ref={bodyTextareaRef}
            name="body"
            value={formData.body}
            onChange={handleChange}
            rows={15}
            className="block w-full px-3 py-2 border border-gray-300 rounded-b-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
            placeholder="Escreva o conteúdo do seu artigo aqui. Você pode usar a sintaxe Markdown."
            required
        />
        <details className="mt-2 text-xs text-gray-500">
            <summary className="cursor-pointer font-medium hover:text-gray-700">Ajuda com a formatação (Markdown)</summary>
            <div className="mt-2 p-4 bg-gray-50 border rounded-md space-y-2 text-gray-600">
                <p className="font-semibold text-gray-700">Sintaxe básica:</p>
                <p><strong>Subtítulos:</strong> Use dois sinais de hash (<code>##</code>) para criar um subtítulo.</p>
                <p><strong>Listas:</strong> Use um hífen (<code>-</code>) para criar listas com marcadores.</p>
                <p><strong>Negrito:</strong> Envolva o texto com <strong>**dois asteriscos**</strong>.</p>
                 <p><strong>Itálico:</strong> Envolva o texto com <em>*um asterisco*</em>.</p>
                <p><strong>Citações:</strong> Use um sinal de maior (<code>&gt;</code>) no início da linha para criar um bloco de citação, útil para destacar informações importantes.</p>
            </div>
        </details>
      </div>
      
      <div className="flex justify-end gap-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
          Cancelar
        </button>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Salvar e Gerar Arquivos
        </button>
      </div>
    </form>
  );
};

export default ArticleForm;