
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import AdSense from './AdSense';

const PageContainer: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <div className="max-w-5xl mx-auto p-4 md:p-8 bg-gray-50">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-10 border border-gray-200">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-300">{title}</h1>
        <div>
            {children}
        </div>
      </div>
    </div>
);

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => (
  <Link to={`/artigos/${article.slug}`} className="block group">
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 transform group-hover:-translate-y-1 h-full flex flex-col border border-gray-200">
      <img className="w-full h-48 object-cover" src={article.image} alt={`Imagem de destaque para ${article.title}`} />
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-blue-800 group-hover:text-blue-600 transition-colors duration-300">{article.title}</h2>
        <p className="text-gray-600 mt-2 text-sm flex-grow">{article.summary}</p>
        <p className="text-xs text-gray-500 mt-4">
          <span>Por: {article.author}</span> | <span>{new Date(article.publish_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
        </p>
      </div>
    </div>
  </Link>
);


const ArticlesListPage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const giscusContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch('/artigos/index.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Article[] = await response.json();
                data.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());
                setArticles(data);
            } catch (e: any) {
                setError('Não foi possível carregar os artigos. Verifique se o arquivo /artigos/index.json existe e está acessível no seu site publicado.');
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
        script.setAttribute("data-repo", "joseluizmed/tempodeatestadonovo2");
        script.setAttribute("data-repo-id", "R_kgDOPP5azg");
        script.setAttribute("data-category", "Announcements");
        script.setAttribute("data-category-id", "DIC_kwDOPP5azs4CtPj3");
        script.setAttribute("data-mapping", "url");
        script.setAttribute("data-strict", "1");
        script.setAttribute("data-reactions-enabled", "1");
        script.setAttribute("data-emit-metadata", "0");
        script.setAttribute("data-input-position", "bottom");
        script.setAttribute("data-theme", "light");
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
            {loading && <p className="text-center text-gray-500 py-10">Carregando artigos...</p>}
            {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-md">{error}</p>}
            {!loading && !error && (
                articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {articles.map(article => (
                            <ArticleCard key={article.slug} article={article} />
                        ))}
                    </div>
                ) : (
                    <p>Nenhum artigo encontrado.</p>
                )
            )}
            
            {!loading && (
                <>
                    <div className="my-12">
                        <AdSense
                            adClient="ca-pub-2071700067184743"
                            adSlot="YOUR_AD_SLOT_ID_HERE_ARTICLES_LIST"
                        />
                    </div>
                    <div className="pt-8 border-t border-gray-300">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Discussões e Dúvidas Gerais</h2>
                        <p className="mb-4 text-gray-600">Tem alguma dúvida geral sobre perícia médica ou algum tema que não foi abordado nos artigos? Use o espaço abaixo para perguntar e interagir com a comunidade.</p>
                        <div id="giscus-container" ref={giscusContainerRef}>
                            <div className="text-gray-600 bg-gray-100 p-4 rounded-md animate-pulse">Carregando comentários...</div>
                        </div>
                   </div>
                </>
            )}

            {!loading && (
                <Link to="/" className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out transform hover:scale-105">
                    Voltar para a página inicial
                </Link>
            )}
        </PageContainer>
    );
};

export default ArticlesListPage;
