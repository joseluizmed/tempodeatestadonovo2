
import React, { useState, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { MedicalCertificate, AnalysisResults, DetailedTimelineSegment, Article } from './types';
import CertificateForm from './components/CertificateForm';
import AnalysisDisplay from './components/AnalysisDisplay';
import { AboutPage, PrivacyPolicyPage, ContactPage, INSSPage } from './components/StaticPages';
import Header from './components/Header';
import InssGuideModal from './components/InssGuideModal';
import InssActionCard from './components/InssActionCard';
import ArticlesListPage from './components/ArticlesListPage';
import ArticlePage from './components/ArticlePage';
import ScrollToTop from './components/ScrollToTop';

// This component is copied from ArticlesListPage to be used on the new HomePage
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

const MonetagAlternatingAd: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const AD_ZONES = ['9916510', '9916505'];
    const SCRIPT_ID = 'monetag-alternating-inpage-push';

    // Decide which ad to show
    const lastShownZone = sessionStorage.getItem('lastMonetagInPagePush');
    const nextZone = lastShownZone === AD_ZONES[0] ? AD_ZONES[1] : AD_ZONES[0];
    sessionStorage.setItem('lastMonetagInPagePush', nextZone);
    
    // Create and append the new script
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = `https://jsc.monetag.com/${nextZone}/tag.min.js`;

    document.body.appendChild(script);

    // Cleanup function to remove the script when location changes.
    return () => {
      const scriptToRemove = document.getElementById(SCRIPT_ID);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [location.pathname]); // Rerun on every route change

  return null; // This component doesn't render anything
}


const App: React.FC = () => {
  const [rawCertificates, setRawCertificates] = useState<MedicalCertificate[]>([]);
  const [processedCertificatesForDisplay, setProcessedCertificatesForDisplay] = useState<MedicalCertificate[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [editingCertificateId, setEditingCertificateId] = useState<string | null>(null);
  const [isGuideModalOpen, setGuideModalOpen] = useState(false);

  useEffect(() => {
    // If there are no certificates, reset the state and do nothing.
    if (rawCertificates.length === 0) {
      setAnalysisResults({
        longestContinuousLeave: { startDate: null, endDate: null, totalDays: 0 },
        totalCertificates: 0,
        continuousSequenceCount: 0,
        overlappingCertificatesCount: 0,
        gapCount: 0,
        totalNonCoveredDaysInGaps: 0,
        timelineSegments: [],
        allDates: [],
      });
      setProcessedCertificatesForDisplay([]);
      return;
    }

    // Create a new worker to perform the analysis in the background.
    const worker = new Worker(new URL('./analysis.worker.ts', import.meta.url), { type: 'module' });

    // Handle messages received from the worker.
    worker.onmessage = (e) => {
      const { results, processedCerts } = e.data;

      // The dates are serialized as strings when passed from the worker.
      // We need to "re-hydrate" them back into Date objects.
      const rehydratedResults: AnalysisResults = {
        ...results,
        longestContinuousLeave: {
          startDate: results.longestContinuousLeave.startDate ? new Date(results.longestContinuousLeave.startDate) : null,
          endDate: results.longestContinuousLeave.endDate ? new Date(results.longestContinuousLeave.endDate) : null,
          totalDays: results.longestContinuousLeave.totalDays
        },
        timelineSegments: results.timelineSegments.map((seg: DetailedTimelineSegment) => ({
            ...seg,
            startDate: new Date(seg.startDate),
            endDate: new Date(seg.endDate),
        })),
        allDates: results.allDates.map((d: string) => new Date(d)),
      };
      
      const rehydratedCerts = processedCerts.map((cert: MedicalCertificate) => ({
          ...cert,
          startDate: new Date(cert.startDate),
          endDate: new Date(cert.endDate),
      }));

      setAnalysisResults(rehydratedResults);
      setProcessedCertificatesForDisplay(rehydratedCerts);
    };

    worker.onerror = (e) => {
        console.error('Error from analysis worker:', e);
    };

    // Send the raw certificate data to the worker to start the analysis.
    worker.postMessage(rawCertificates);

    // Clean up the worker when the component unmounts or dependencies change.
    return () => {
      worker.terminate();
    };
  }, [rawCertificates]);


  const handleSaveCertificate = useCallback((newCertData: Omit<MedicalCertificate, 'id' | 'displayId' | 'status'>, editingId: string | null) => {
    if (editingId) {
      setRawCertificates(prevCerts =>
        prevCerts.map(cert =>
          cert.id === editingId
            ? { ...cert, 
                startDate: newCertData.startDate,
                endDate: newCertData.endDate,
                days: newCertData.days,
                originalStartDateString: newCertData.originalStartDateString,
                originalEndDateString: newCertData.originalEndDateString,
                originalDaysString: newCertData.originalDaysString,
              }
            : cert
        )
      );
      setEditingCertificateId(null); 
    } else { 
      const newCertificate: MedicalCertificate = {
        ...newCertData,
        id: `cert-${new Date().getTime()}-${Math.random().toString(36).substr(2, 9)}`,
        displayId: 0, 
      };
      setRawCertificates(prevCerts => [...prevCerts, newCertificate]);
    }
  }, []);

  const handleRemoveCertificate = useCallback((idToRemove: string) => {
    setRawCertificates(prevCerts => prevCerts.filter(cert => cert.id !== idToRemove));
    if (editingCertificateId === idToRemove) {
        setEditingCertificateId(null);
    }
  }, [editingCertificateId]);

  const handleNewAnalysis = useCallback(() => {
    setRawCertificates([]);
    setEditingCertificateId(null);
  }, []);

  const handleStartEdit = useCallback((id: string) => {
    setEditingCertificateId(id);
    const formElement = document.getElementById('certificate-form-section');
    formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingCertificateId(null);
  }, []);
  
  const certificateToEdit = editingCertificateId ? rawCertificates.find(c => c.id === editingCertificateId) : null;

  const RecentArticles = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchArticles = async () => {
        try {
          const response = await fetch('/artigos/index.json');
          const data: Article[] = await response.json();
          data.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());
          setArticles(data.slice(0, 4)); // Get latest 4 articles
        } catch (error) {
          console.error("Failed to fetch articles:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchArticles();
    }, []);

    if (loading) return <p className="text-center text-gray-500 py-10">Carregando artigos...</p>;
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map(article => (
                <ArticleCard key={article.slug} article={article} />
            ))}
        </div>
    );
  };

  const HomePage = () => (
    <>
      <div className="relative bg-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Aperto de mãos simbolizando acordo e confiança" 
              className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-800/70" aria-hidden="true"></div>
        </div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Descomplique o INSS e Entenda Seus Direitos</h1>
          <p className="text-lg mt-4 opacity-90 max-w-3xl mx-auto">
            Artigos, dicas e uma ferramenta gratuita para calcular seus prazos de afastamento.
          </p>
          <Link 
            to="/calculadora-de-atestado" 
            className="mt-8 inline-block bg-white text-blue-700 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-200 transition duration-300 transform hover:scale-105"
          >
            Calcule seus atestados agora
          </Link>
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800">Seja Bem-Vindo(a)!</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Explore nossas ferramentas e seções para encontrar as informações que você precisa sobre atestados, perícia médica e seus direitos no INSS.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Card 1: Calculadora */}
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-center flex flex-col hover:shadow-xl transition-shadow duration-300">
                    <div className="text-blue-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Calculadora de Atestado</h3>
                    <p className="text-gray-600 flex-grow">Calcule períodos, identifique sobreposições e dias não cobertos entre seus atestados.</p>
                    <Link to="/calculadora-de-atestado" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-150 transform hover:scale-105">
                        Acessar Calculadora
                    </Link>
                </div>

                {/* Card 2: Dúvidas */}
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-center flex flex-col hover:shadow-xl transition-shadow duration-300">
                    <div className="text-blue-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Dúvidas sobre Perícia</h3>
                    <p className="text-gray-600 flex-grow">Artigos, guias e um fórum para tirar suas dúvidas sobre a perícia médica e seus direitos.</p>
                    <Link to="/artigos" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-150 transform hover:scale-105">
                        Ver Artigos
                    </Link>
                </div>

                {/* Card 3: Benefícios */}
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-center flex flex-col hover:shadow-xl transition-shadow duration-300">
                    <div className="text-blue-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Benefícios do INSS</h3>
                    <p className="text-gray-600 flex-grow">Entenda sobre o Benefício por Incapacidade Temporária e como agendar sua perícia.</p>
                    <Link to="/beneficio-inss" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-150 transform hover:scale-105">
                        Saiba Mais
                    </Link>
                </div>

                {/* Card 4: Sobre */}
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-center flex flex-col hover:shadow-xl transition-shadow duration-300">
                    <div className="text-blue-600 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Sobre o Autor</h3>
                    <p className="text-gray-600 flex-grow">Conheça a motivação e a experiência do Dr. José Luiz na criação deste projeto.</p>
                    <Link to="/sobre" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-150 transform hover:scale-105">
                        Conhecer
                    </Link>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Artigos Recentes sobre Perícia Médica e Benefícios</h2>
        <RecentArticles />
      </div>
    </>
  );

  const CalculatorPage = () => {
    useEffect(() => {
      const scriptId = 'monetag-inpage-push-calculator';
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

    return (
      <>
        <div className="container mx-auto px-2 sm:px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">Calculadora de Tempo de Afastamento por Atestado Médico</h1>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
              <CertificateForm 
                onSaveCertificate={handleSaveCertificate}
                editingCertificate={certificateToEdit || null}
                onCancelEdit={handleCancelEdit}
              />
            </div>
            <div className="lg:w-2/3">
              <div className="space-y-8">
                <AnalysisDisplay
                  certificates={processedCertificatesForDisplay} 
                  analysisResults={analysisResults}
                  onRemoveCertificate={handleRemoveCertificate}
                  onEditCertificate={handleStartEdit}
                  onNewAnalysis={handleNewAnalysis}
                />
                <InssActionCard 
                  analysisResults={analysisResults} 
                  onOpenGuide={() => setGuideModalOpen(true)} 
                />
              </div>
            </div>
          </div>
          
          <section className="mt-12 py-8 px-6 bg-white shadow-lg rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 pb-3 border-b border-gray-300">🧭 Informações sobre o uso da ferramenta</h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>Esta aplicação foi desenvolvida para facilitar o cálculo e a visualização dos períodos de afastamento médico de forma clara e automatizada. O uso é simples e intuitivo, pensado para atender tanto o público geral quanto profissionais da área.</p>
                
                <h3>🔹 Como utilizar</h3>
                <ul>
                    <li><strong>Adicionar/Editar Atestado:</strong> Informe a data de início e, em seguida, escolha entre indicar a data de término ou a quantidade de dias de afastamento. Clique em "Adicionar" ou pressione a tecla "Enter" para incluir um novo atestado ou "Salvar Alterações" para atualizar um registro existente.</li>
                    <li><strong>Análise Automática:</strong> Os dados são processados automaticamente, exibindo o total de dias, o maior afastamento contínuo e a visualização na linha do tempo.</li>
                    <li>
                        <strong>Linha do Tempo:</strong>
                        <ul>
                            <li>🟩 Verde – Dias cobertos por um único atestado.</li>
                            <li>🟨 Amarelo – Dias com sobreposição de atestados.</li>
                            <li>🟥 Vermelho – Dias não cobertos entre afastamentos.</li>
                            <li>🔷 Borda Azul – Indica o maior afastamento contínuos.</li>
                        </ul>
                    </li>
                    <li><strong>Atestados Registrados:</strong> Visualize todos os atestados em uma tabela interativa, com opção de edição ou exclusão. A classificação (Contínuo, Não Contínuo etc.) é gerada com base na ordem cronológica.</li>
                    <li><strong>Nova Análise:</strong> Clique neste botão para limpar os dados e iniciar uma nova simulação.</li>
                </ul>

                <h3>⚠️ Atenção</h3>
                <ul>
                    <li>O cálculo inclui tanto a data de início quanto a de término. Exemplo: 01/01 a 05/01 = 5 dias.</li>
                    <li>A continuidade considera atestados que se sucedem sem interrupção entre as datas.</li>
                    <li>Esta ferramenta tem caráter informativo e não substitui a análise de profissionais especializados (como médicos peritos, setores de RH ou assessoria jurídica). Normas específicas podem variar conforme o contexto e a legislação vigente.</li>
                </ul>
            </div>
          </section>
        </div>
      </>
    )
  };

  return (
    <HashRouter>
      <ScrollToTop />
      <MonetagAlternatingAd />
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/calculadora-de-atestado" element={<CalculatorPage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/politica-de-privacidade" element={<PrivacyPolicyPage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/beneficio-inss" element={<INSSPage onOpenGuide={() => setGuideModalOpen(true)} />} />
            <Route path="/artigos" element={<ArticlesListPage />} />
            <Route path="/artigos/:slug" element={<ArticlePage />} />
          </Routes>
        </main>

        <InssGuideModal 
          isOpen={isGuideModalOpen} 
          onClose={() => setGuideModalOpen(false)} 
        />

        <footer className="bg-gray-800 text-gray-300 text-center py-8">
          <div className="container mx-auto px-4">
            <p className="mb-4 text-sm">
              © 2025 Site Atestado e Perícia Médica | Desenvolvido por Dr. José Luiz de Souza Neto (CRM/RN 4271) – Todos os direitos reservados. Versão 6.0
            </p>
            <nav className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm">
              <Link to="/" className="px-3 py-1 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-150">Início</Link>
              <span className="text-gray-500 hidden md:inline">&middot;</span>
              <Link to="/sobre" className="px-3 py-1 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-150">Sobre</Link>
              <span className="text-gray-500 hidden md:inline">&middot;</span>
              <Link to="/calculadora-de-atestado" className="px-3 py-1 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-150">Calculadora de Atestado</Link>
              <span className="text-gray-500 hidden md:inline">&middot;</span>
              <Link to="/artigos" className="px-3 py-1 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-150">Perícia Médica [Dúvidas e Respostas]</Link>
              <span className="text-gray-500 hidden md:inline">&middot;</span>
              <Link to="/beneficio-inss" className="px-3 py-1 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-150">Benefícios do INSS</Link>
              <span className="text-gray-500 hidden md:inline">&middot;</span>
              <Link to="/politica-de-privacidade" className="px-3 py-1 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-150 text-center">Política de Privacidade</Link>
              <span className="text-gray-500 hidden md:inline">&middot;</span>
              <Link to="/contato" className="px-3 py-1 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-150">Contato</Link>
            </nav>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;