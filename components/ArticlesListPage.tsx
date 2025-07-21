
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';

const PageContainer: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <div className="max-w-4xl mx-auto p-6 md:p-10 bg-white shadow-xl rounded-lg my-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-300">{title}</h1>
        <div>
            {children}
        </div>
    </div>
);

const ArticlesListPage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const giscusContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const pathsToTry = ['artigos/index.json', '_artigos/index.json'];
                let response: Response | null = null;
                
                for (const path of pathsToTry) {
                    // Use relative paths, safe with HashRouter and more robust
                    const res = await fetch(`${path}?v=${new Date().getTime()}`);
                    if (res.ok) {
                        response = res;
                        break;
                    }
                }

                if (!response) {
                    throw new Error('404 Not Found');
                }
                
                const data: Article[] = await response.json();
                data.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());
                setArticles(data);
            } catch (e: any) {
                setError('Não foi possível carregar os artigos. Verifique se o arquivo `artigos/index.json` ou `_artigos/index.json` existe e está acessível.');
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    useEffect(() => {
        if (loading || !giscusContainerRef.current) {
            return;
        }

        const script = document.createElement('script');
        script.src = "https://giscus.app/client.js";
        script.setAttribute("data-repo", "joseluizmed/tempodeatestadobase");
        script.setAttribute("data-repo-id", "R_kgDOPKjMnw");
        script.setAttribute("data-category", "Announcements");
        script.setAttribute("data-category-id", "DIC_kwDOPKjMn84CtL4l");
        script.setAttribute("data-mapping", "url");
        script.setAttribute("data-strict", "0");
        script.setAttribute("data-reactions-enabled", "1");
        script.setAttribute("data-emit-metadata", "0");
        script.setAttribute("data-input-position", "top");
        script.setAttribute("data-theme", "preferred_color_scheme");
        script.setAttribute("data-lang", "pt");
        script.setAttribute("crossorigin", "anonymous");
        script.async = true;

        const container = giscusContainerRef.current;
        container.innerHTML = "";
        container.appendChild(script);

        return () => {
            if (container) {
                container.innerHTML = "";
            }
        };
    }, [loading]);

    return (
        <PageContainer title="Perícia Médica [Dúvidas e Respostas]">
            {loading && <p className="text-center text-gray-500">Carregando artigos...</p>}
            {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</p>}
            {!loading && !error && (
                articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {articles.map(article => (
                            <Link to={`/artigos/${article.slug}`} key={article.slug} className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group no-underline">
                                <div className="relative">
                                    <img 
                                        src={article.image || 'https://images.unsplash.com/photo-1516549655169-df83a0877521?w=500&h=300&fit=crop'} 
                                        alt={`Imagem de destaque para o artigo ${article.title}`}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                                </div>
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">{article.title}</h2>
                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{article.summary || 'Leia mais para descobrir...'}</p>
                                    <div className="text-xs text-gray-500 mt-auto">
                                        <span>Por {article.author}</span> | <span>{new Date(article.publish_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p>Nenhum artigo encontrado.</p>
                )
            )}
            
            {!loading && (
                 <div className="mt-12 pt-8 border-t border-gray-300">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Discussões e Dúvidas Gerais</h2>
                    <p className="mb-4 text-gray-600">Tem alguma dúvida geral sobre perícia médica ou algum tema que não foi abordado nos artigos? Use o espaço abaixo para perguntar e interagir com a comunidade.</p>
                    <div id="giscus-container" ref={giscusContainerRef}>
                        <p className="text-gray-600 bg-gray-100 p-4 rounded-md">Carregando comentários...</p>
                    </div>
               </div>
            )}
        </PageContainer>
    );
};

export default ArticlesListPage;
