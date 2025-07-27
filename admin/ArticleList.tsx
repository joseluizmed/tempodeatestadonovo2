import React from 'react';
import { Article } from '../types';

interface ArticleListProps {
  articles: Article[];
  onCreate: () => void;
  onEdit: (slug: string) => void;
  onDelete: (slug: string) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, onCreate, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Seus Artigos</h2>
        <button
          onClick={onCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          + Criar Novo Artigo
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Publicação</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.length > 0 ? articles.map(article => (
              <tr key={article.slug}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{article.title}</div>
                  <div className="text-sm text-gray-500">{article.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(article.publish_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onEdit(article.slug)} className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</button>
                  <button onClick={() => onDelete(article.slug)} className="text-red-600 hover:text-red-900">Excluir</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">Nenhum artigo encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArticleList;
