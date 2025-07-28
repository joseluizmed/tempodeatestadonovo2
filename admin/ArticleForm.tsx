import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    setFormData(article);
  }, [article]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
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
      <InputField name="image" label="URL da Imagem de Destaque" value={formData.image} onChange={handleChange} />

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
        <label htmlFor="body" className="block text-sm font-medium text-gray-700">Corpo do Artigo (em Markdown)</label>
        <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            rows={15}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
            placeholder="Escreva o conteúdo do seu artigo aqui. Você pode usar a sintaxe Markdown."
            required
        />
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