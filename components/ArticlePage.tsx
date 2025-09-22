import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import { ArticleDetails } from '../types';
import { parseMarkdown } from '../utils/markdownParser';
import CommunityOrAIAssistant from './CommunityOrAIAssistant';

const ArticlePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [article, setArticle] = useState<ArticleDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) {
            setError("Nenhum artigo especificado.");
            setLoading(false);
            return;
        };

        const fetchArticle = async () => {
            try {
                const response = await fetch(`/artigos/${slug}.md`);
                if (!response.ok) {
                    throw new Error('Artigo não encontrado. Verifique o slug na URL e se o arquivo .md correspondente existe na pasta `/artigos` do seu site.');
                }
                const rawContent = await response.text();
                const parsedArticle = parseMarkdown(slug, rawContent);
                if (!parsedArticle) {
                    throw new Error('Falha ao processar o arquivo do artigo.');
                }
                
                const htmlBody = await marked.parse(parsedArticle.body, { async: true, gfm: true });
                setArticle({ ...parsedArticle, body: htmlBody });

            } catch (e: any) {
                setError(e.message || 'Ocorreu um erro ao buscar o artigo.');
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [slug]);

    useEffect(() => {
        const scriptId = 'monetag-interstitial-script';
        if (document.getElementById(scriptId)) {
            return;
        }
        const script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.dataset.cfasync = 'false';
        script.src = "https://jsc.monetag.com/9916519/tag.min.js";
        document.body.appendChild(script);

        return () => {
            const existingScript = document.getElementById(scriptId);
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto my-8 p-10">
                <div className="w-full h-72 bg-gray-200 rounded-lg animate-pulse mb-8"></div>
                <div className="h-10 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-8 animate-pulse"></div>
                <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return <div className="max-w-4xl mx-auto my-8 p-6 bg-red-100 text-red-700 rounded-lg shadow-md">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 bg-gray-50">
            <div className="bg-white shadow-xl rounded-lg my-8 border border-gray-200 overflow-hidden">
                {article && (
                    <>
                        {article.image && (
                            <img 
                                src={article.image} 
                                alt={`Imagem de destaque para ${article.title}`} 
                                className="w-full h-64 md:h-80 object-cover" 
                            />
                        )}
                        <div className="p-6 md:p-10">
                            <article className="prose prose-lg max-w-none prose-h1:text-gray-800 prose-h2:text-gray-700 prose-a:text-blue-600 hover:prose-a:text-blue-800">
                                <h1 className="text-4xl font-bold mb-2">{article.title}</h1>
                                <div className="text-base text-gray-500 mb-8">
                                    <span>Por {article.author}</span> | <span>Publicado em {new Date(article.publish_date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: article.body }} />
                            </article>
                            
                            <div className="pt-8 mt-12 border-t border-gray-300">
                                <CommunityOrAIAssistant contextTitle={article.title} />
                            </div>

                            <Link to="/artigos" className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out transform hover:scale-105 no-underline">
                                &larr; Voltar para a lista de artigos
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ArticlePage;