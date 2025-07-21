
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import { ArticleDetails } from '../types';
import { parseMarkdown } from '../utils/markdownParser';

const ArticlePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [article, setArticle] = useState<ArticleDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const commentsContainerRef = useRef<HTMLDivElement>(null);

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
                    throw new Error('Artigo não encontrado. Verifique o nome do arquivo e se ele existe na pasta `artigos`.');
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
        if (loading || error || !commentsContainerRef.current) {
            return;
        }

        const script = document.createElement('script');
        script.src = "https://giscus.app/client.js";
        script.setAttribute("data-repo", "joseluizmed/tempodeatestadobase");
        script.setAttribute("data-repo-id", "R_kgDOPKjMnw");
        script.setAttribute("data-category", "Announcements");
        script.setAttribute("data-category-id", "DIC_kwDOPKjMn84CtL4l");
        script.setAttribute("data-mapping", "url");
        script.setAttribute("data-strict", "1");
        script.setAttribute("data-reactions-enabled", "1");
        script.setAttribute("data-emit-metadata", "0");
        script.setAttribute("data-input-position", "top");
        script.setAttribute("data-theme", "preferred_color_scheme");
        script.setAttribute("data-lang", "pt");
        script.setAttribute("crossorigin", "anonymous");
        script.async = true;

        commentsContainerRef.current.innerHTML = "";
        commentsContainerRef.current.appendChild(script);

        return () => {
            if (commentsContainerRef.current) {
                commentsContainerRef.current.innerHTML = "";
            }
        };
    }, [loading, error]);

    if (loading) {
        return <div className="text-center p-10">Carregando artigo...</div>;
    }
    
    if (error) {
        return <div className="max-w-4xl mx-auto my-8 p-6 bg-red-100 text-red-700 rounded-lg shadow-md">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-10 bg-white shadow-xl rounded-lg my-8 border border-gray-200">
            {article && (
                <>
                    {article.image && (
                        <img 
                            src={article.image} 
                            alt={`Imagem de destaque para o artigo ${article.title}`} 
                            className="w-full h-auto max-h-96 object-cover rounded-lg mb-8 shadow-md"
                        />
                    )}
                    <article className="prose prose-lg max-w-none prose-h1:text-gray-800 prose-h2:text-gray-700 prose-a:text-blue-600 hover:prose-a:text-blue-800">
                        <h1 className="text-4xl font-bold mb-2">{article.title}</h1>
                        <div className="text-base text-gray-500 mb-8">
                            <span>Por {article.author}</span> | <span>Publicado em {new Date(article.publish_date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: article.body }} />
                    </article>

                    <div className="mt-12 pt-8 border-t border-gray-300">
                         <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comentários</h2>
                         <div id="area-comentarios" ref={commentsContainerRef}>
                            <p className="text-gray-600 bg-gray-100 p-4 rounded-md">Carregando comentários...</p>
                         </div>
                    </div>

                    <Link to="/artigos" className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out transform hover:scale-105 no-underline">
                        &larr; Voltar para a lista de artigos
                    </Link>
                </>
            )}
        </div>
    );
};

export default ArticlePage;