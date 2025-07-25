
import React, { useState, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { MedicalCertificate, AnalysisResults, CertificateStatus, DetailedTimelineSegment } from './types';
import CertificateForm from './components/CertificateForm';
import AnalysisDisplay from './components/AnalysisDisplay';
import { AboutPage, PrivacyPolicyPage, ContactPage, INSSPage } from './components/StaticPages';
import Header from './components/Header';
import InssGuideModal from './components/InssGuideModal';
import InssActionCard from './components/InssActionCard';
import AdSense from './components/AdSense';
import ArticlesListPage from './components/ArticlesListPage';
import ArticlePage from './components/ArticlePage';
import { formatDate, addDays, differenceInDays } from './utils/dateUtils';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  const [rawCertificates, setRawCertificates] = useState<MedicalCertificate[]>([]);
  const [processedCertificatesForDisplay, setProcessedCertificatesForDisplay] = useState<MedicalCertificate[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [editingCertificateId, setEditingCertificateId] = useState<string | null>(null);
  const [isGuideModalOpen, setGuideModalOpen] = useState(false);

  const analyzeCertificates = useCallback((certsInput: MedicalCertificate[]): {
    results: AnalysisResults,
    processedCerts: MedicalCertificate[]
  } => {
    const initialEmptyResults: AnalysisResults = {
      longestContinuousLeave: { startDate: null, endDate: null, totalDays: 0 },
      totalCertificates: 0,
      continuousSequenceCount: 0,
      overlappingCertificatesCount: 0,
      gapCount: 0,
      totalNonCoveredDaysInGaps: 0,
      timelineSegments: [],
      allDates: []
    };

    const validCerts = certsInput.filter(c => 
      c.startDate instanceof Date && !isNaN(c.startDate.getTime()) &&
      c.endDate instanceof Date && !isNaN(c.endDate.getTime()) &&
      c.startDate.getTime() <= c.endDate.getTime() // Ensure start is not after end
    );

    if (validCerts.length === 0) {
      return {
        results: initialEmptyResults,
        processedCerts: []
      };
    }

    const sortedCerts = [...validCerts].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    
    const certsWithDisplayIdAndStatus = sortedCerts.map((cert, index, arr) => {
        let status: CertificateStatus = CertificateStatus.FIRST;
        if (index > 0) {
            const prevCert = arr[index-1]; 
            if (addDays(prevCert.endDate, 1).getTime() === cert.startDate.getTime()) {
                status = CertificateStatus.CONTINUOUS;
            } else if (cert.startDate <= prevCert.endDate) { 
                status = CertificateStatus.OVERLAPPING; 
            } else { 
                status = CertificateStatus.NON_CONTINUOUS;
            }
        }
        return { ...cert, displayId: index + 1, status };
    });
    
    let allDatesSet = new Set<number>();
    certsWithDisplayIdAndStatus.forEach(c => { 
      allDatesSet.add(c.startDate.getTime());
      allDatesSet.add(addDays(c.endDate, 1).getTime()); 
    });
    
    const uniqueSortedDates = Array.from(allDatesSet).sort((a, b) => a - b).map(time => new Date(time));
    
    if (uniqueSortedDates.length === 0 && certsWithDisplayIdAndStatus.length > 0) {
        return { 
            results: { ...initialEmptyResults, totalCertificates: certsWithDisplayIdAndStatus.length },
            processedCerts: certsWithDisplayIdAndStatus
        };
    }

    if (uniqueSortedDates.length <= 1 && certsWithDisplayIdAndStatus.length === 1 ) {
        const singleCert = certsWithDisplayIdAndStatus[0];
        const segments: DetailedTimelineSegment[] = [{
            id: `seg-${singleCert.startDate.getTime()}`,
            startDate: singleCert.startDate,
            endDate: singleCert.endDate,
            type: 'covered',
            durationDays: singleCert.days,
            certificatesInvolved: [singleCert.id],
            tooltip: `${formatDate(singleCert.startDate)} - ${formatDate(singleCert.endDate)} (${singleCert.days} dia${singleCert.days > 1 ? 's' : ''}, Coberto)`
        }];
        return {
            results: {
                longestContinuousLeave: { startDate: singleCert.startDate, endDate: singleCert.endDate, totalDays: singleCert.days },
                totalCertificates: 1,
                continuousSequenceCount: 0, 
                overlappingCertificatesCount: 0, 
                gapCount: 0,
                totalNonCoveredDaysInGaps: 0,
                timelineSegments: segments,
                allDates: [singleCert.startDate, singleCert.endDate]
            },
            processedCerts: certsWithDisplayIdAndStatus
        };
    }
    
    if (uniqueSortedDates.length === 0) { 
         return { 
            results: initialEmptyResults,
            processedCerts: []
        };
    }

    const timelineSegments: DetailedTimelineSegment[] = [];
    for (let i = 0; i < uniqueSortedDates.length -1; i++) {
        const intervalStart = uniqueSortedDates[i];
        const intervalEnd = addDays(uniqueSortedDates[i+1], -1); 
        
        if (intervalStart.getTime() > intervalEnd.getTime()) continue; 

        const midPoint = new Date(intervalStart.getTime() + (intervalEnd.getTime() - intervalStart.getTime()) / 2);
        
        const activeCertsInInterval = certsWithDisplayIdAndStatus.filter(
            c => c.startDate <= midPoint && c.endDate >= midPoint
        );
        const coverageCount = activeCertsInInterval.length;
        const duration = differenceInDays(intervalStart, intervalEnd) + 1;

        if (duration <= 0) continue; // Should not happen with valid intervalStart/End

        let type: 'covered' | 'overlapping' | 'gap';
        let typeTooltip: string;
        if (coverageCount === 0) { type = 'gap'; typeTooltip = 'Não Coberto'; }
        else if (coverageCount === 1) { type = 'covered'; typeTooltip = 'Coberto'; }
        else { type = 'overlapping'; typeTooltip = 'Sobreposto'; }
        
        timelineSegments.push({
            id: `seg-${intervalStart.getTime()}`,
            startDate: intervalStart,
            endDate: intervalEnd,
            type: type,
            durationDays: duration,
            certificatesInvolved: activeCertsInInterval.map(c => c.id),
            tooltip: `${formatDate(intervalStart)} - ${formatDate(intervalEnd)} (${duration} dia${duration > 1 ? 's' : ''}, ${typeTooltip})`
        });
    }
    
    let longestContinuousLeave = { startDate: null as Date | null, endDate: null as Date | null, totalDays: 0 };
    let currentLeaveStart: Date | null = null;
    let currentLeaveDays = 0;

    timelineSegments.forEach(seg => {
      if (seg.type === 'covered' || seg.type === 'overlapping') {
        if (currentLeaveStart === null) {
          currentLeaveStart = seg.startDate;
        }
        currentLeaveDays += seg.durationDays;
        if (currentLeaveDays > longestContinuousLeave.totalDays) {
          longestContinuousLeave = { startDate: currentLeaveStart, endDate: seg.endDate, totalDays: currentLeaveDays };
        }
      } else { 
        currentLeaveStart = null;
        currentLeaveDays = 0;
      }
    });

    const totalNonCoveredDaysInGaps = timelineSegments.filter(s => s.type === 'gap').reduce((sum, s) => sum + s.durationDays, 0);
    const gapCount = timelineSegments.filter(s => s.type === 'gap').length;
    
    let continuousSequenceCount = 0;
    for(let i = 0; i < certsWithDisplayIdAndStatus.length; i++) {
        if(certsWithDisplayIdAndStatus[i].status === CertificateStatus.CONTINUOUS) {
            continuousSequenceCount++;
        }
    }
    
    const overlappingCertSet = new Set<string>();
    timelineSegments.filter(s => s.type === 'overlapping').forEach(s => {
        s.certificatesInvolved.forEach(certId => overlappingCertSet.add(certId));
    });

    let timelineEffectiveStart: Date | null = null;
    let timelineEffectiveEnd: Date | null = null;

    if (timelineSegments.length > 0) {
        timelineEffectiveStart = timelineSegments[0].startDate;
        timelineEffectiveEnd = timelineSegments[timelineSegments.length - 1].endDate;
    } else if (uniqueSortedDates.length > 0) { // Fallback if no segments but there are dates (e.g. single point in time)
        timelineEffectiveStart = uniqueSortedDates[0];
        timelineEffectiveEnd = addDays(uniqueSortedDates[uniqueSortedDates.length - 1], -1);
        if (timelineEffectiveStart && timelineEffectiveEnd && timelineEffectiveStart.getTime() > timelineEffectiveEnd.getTime()) {
           // If only one unique date point, end becomes start for a single day representation
           timelineEffectiveEnd = timelineEffectiveStart;
        }
    }
        
    const analysisData: AnalysisResults = {
      longestContinuousLeave,
      totalCertificates: certsWithDisplayIdAndStatus.length,
      continuousSequenceCount,
      overlappingCertificatesCount: overlappingCertSet.size,
      gapCount,
      totalNonCoveredDaysInGaps,
      timelineSegments: timelineSegments,
      allDates: timelineEffectiveStart && timelineEffectiveEnd ? [timelineEffectiveStart, timelineEffectiveEnd] : []
    };

    return {
        results: analysisData,
        processedCerts: certsWithDisplayIdAndStatus
    };
  }, []); 

  useEffect(() => {
    const { results, processedCerts } = analyzeCertificates(rawCertificates);
    setAnalysisResults(results);
    setProcessedCertificatesForDisplay(processedCerts);
  }, [rawCertificates, analyzeCertificates]);

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

  const HomePage = () => (
    <>
      <div className="bg-blue-600 text-white py-12 px-4 text-center shadow-inner">
        <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold">Tempo de Atestado</h1>
            <p className="text-lg mt-2 opacity-90 max-w-3xl mx-auto">
              Calcule períodos efetivamente cobertos a partir de atestados concedidos, identifique sobreposições e eventuais dias não cobertos entre os afastamentos.
            </p>
        </div>
      </div>
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <CertificateForm 
              onSaveCertificate={handleSaveCertificate}
              editingCertificate={certificateToEdit || null}
              onCancelEdit={handleCancelEdit}
            />
             <div className="mt-8">
               <AdSense
                 adClient="ca-pub-2071700067184743"
                 adSlot="YOUR_AD_SLOT_ID_HERE_SIDEBAR"
               />
             </div>
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
                          <li>🔷 Borda Azul – Indica o maior afastamento contínuo.</li>
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
        <div className="my-8">
            <AdSense
                adClient="ca-pub-2071700067184743"
                adSlot="YOUR_AD_SLOT_ID_HERE_BOTTOM"
            />
        </div>
      </div>
    </>
  );

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
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
              © 2025 Tempo de Atestado | Desenvolvido por Dr. José Luiz de Souza Neto (CRM/RN 4271) – Todos os direitos reservados. Versão 5.5
            </p>
            <nav className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm">
              <Link to="/" className="px-3 py-1 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-150">Início</Link>
              <span className="text-gray-500 hidden md:inline">&middot;</span>
              <Link to="/sobre" className="px-3 py-1 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-150">Sobre</Link>
              <span className="text-gray-500 hidden md:inline">&middot;</span>
              <Link to="/artigos" className="px-3 py-1 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-150">Perícia Médica [Dúvidas e Respostas]</Link>
              <span className="text-gray-500 hidden md:inline">&middot;</span>
              <Link to="/beneficio-inss" className="px-3 py-1 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-150">Benefício INSS</Link>
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