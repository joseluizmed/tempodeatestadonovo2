import React, { useState, useEffect, useCallback } from 'react';
import { Article, ArticleDetails } from '../types';
import { parseMarkdown } from '../utils/markdownParser';
import ArticleList from './ArticleList';
import ArticleForm from './ArticleForm';
import GeneratedOutput from './GeneratedOutput';

const AdminApp: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'form' | 'output'>('list');
  const [editingArticle, setEditingArticle] = useState<ArticleDetails | null>(null);
  const [generatedContent, setGeneratedContent] = useState<{ json: string; md?: string; mdFilename?: string, instructions?: string } | null>(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/artigos/index.json');
      if (!response.ok) {
        throw new Error(`Não foi possível carregar o índice de artigos (HTTP ${response.status}). Verifique se o arquivo public/artigos/index.json existe.`);
      }
      const data: Article[] = await response.json();
      setArticles(data);
    } catch (e: any) {
      setError(e.message);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleCreate = () => {
    setEditingArticle({
      slug: '',
      title: '',
      author: 'Dr. José Luiz de Souza Neto',
      publish_date: new Date().toISOString(),
      image: '',
      summary: '',
      body: ''
    });
    setView('form');
  };

  const handleEdit = async (slug: string) => {
    try {
      const response = await fetch(`/artigos/${slug}.md`);
      if (!response.ok) throw new Error(`Artigo ${slug}.md não encontrado.`);
      const rawContent = await response.text();
      const parsed = parseMarkdown(slug, rawContent);
      if (parsed) {
        setEditingArticle(parsed);
        setView('form');
      } else {
        throw new Error("Falha ao parsear o artigo.");
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleSave = (updatedArticle: ArticleDetails) => {
    const isNew = !articles.some(a => a.slug === updatedArticle.slug);
    let updatedList: Article[];

    const newArticleEntry: Article = {
      slug: updatedArticle.slug,
      title: updatedArticle.title,
      publish_date: updatedArticle.publish_date,
      author: updatedArticle.author,
      image: updatedArticle.image,
      summary: updatedArticle.summary
    };

    if (isNew) {
      updatedList = [...articles, newArticleEntry];
    } else {
      updatedList = articles.map(a => a.slug === updatedArticle.slug ? newArticleEntry : a);
    }
    
    updatedList.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());

    const jsonContent = JSON.stringify(updatedList, null, 2);

    const mdContent = `---
title: "${updatedArticle.title.replace(/"/g, '\\"')}"
publish_date: "${updatedArticle.publish_date}"
author: "${updatedArticle.author}"
image: "${updatedArticle.image}"
summary: "${updatedArticle.summary.replace(/"/g, '\\"')}"
---

${updatedArticle.body}`;

    setGeneratedContent({
      json: jsonContent,
      md: mdContent,
      mdFilename: `public/artigos/${updatedArticle.slug}.md`,
    });
    setView('output');
  };

  const handleDelete = (slug: string) => {
    const updatedList = articles.filter(a => a.slug !== slug);
    const jsonContent = JSON.stringify(updatedList, null, 2);
    setGeneratedContent({
      json: jsonContent,
      instructions: `Agora, exclua manualmente o arquivo: public/artigos/${slug}.md`
    });
    setView('output');
  };

  const handleReturnToList = () => {
    setEditingArticle(null);
    setGeneratedContent(null);
    fetchArticles(); // Re-fetch to reflect potential manual changes
    setView('list');
  };

  const renderContent = () => {
    if (loading) return <p className="text-center text-gray-500 py-10">Carregando artigos...</p>;
    if (error) return <p className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</p>;

    switch (view) {
      case 'form':
        return <ArticleForm article={editingArticle!} onSave={handleSave} onCancel={handleReturnToList} />;
      case 'output':
        return <GeneratedOutput content={generatedContent!} onBack={handleReturnToList} />;
      case 'list':
      default:
        return <ArticleList articles={articles} onCreate={handleCreate} onEdit={handleEdit} onDelete={handleDelete} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-gray-800 text-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold">⚙️ Gerenciador de Artigos</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminApp;
