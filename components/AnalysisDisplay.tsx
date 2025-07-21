
import React from 'react';
import { MedicalCertificate, AnalysisResults, CertificateStatus, DetailedTimelineSegment } from '../types';
import { formatDate, differenceInDays } from '../utils/dateUtils';
import Tooltip from './Tooltip';

interface AnalysisDisplayProps {
  certificates: MedicalCertificate[];
  analysisResults: AnalysisResults | null;
  onRemoveCertificate: (id: string) => void;
  onEditCertificate: (id: string) => void; 
  onNewAnalysis: () => void;
}

const StatCard: React.FC<{title: string; value: string | number; colorClass?: string; large?: boolean}> = ({ title, value, colorClass = "bg-blue-50", large = false }) => (
  <div className={`p-4 rounded-lg shadow ${colorClass} ${large ? 'col-span-2 md:col-span-1 xl:col-span-2' : 'col-span-1'}`}>
    <h3 className={`text-sm font-medium ${large ? 'text-gray-600' : 'text-gray-500'}`}>{title}</h3>
    <p className={`font-bold ${large ? 'text-3xl text-blue-600' : 'text-2xl text-gray-800'}`}>{value}</p>
  </div>
);

const TimelineBar: React.FC<{ segments: DetailedTimelineSegment[], overallStart: Date, overallEnd: Date, longestContinuousLeave: AnalysisResults['longestContinuousLeave'] | null }> = ({ segments, overallStart, overallEnd, longestContinuousLeave }) => {
  if (segments.length === 0 || 
      !overallStart || !(overallStart instanceof Date) || isNaN(overallStart.getTime()) ||
      !overallEnd || !(overallEnd instanceof Date) || isNaN(overallEnd.getTime())) {
    return <div className="h-10 bg-gray-200 rounded-md animate-pulse text-xs flex items-center justify-center text-gray-500">Aguardando dados...</div>;
  }

  const totalDuration = differenceInDays(overallStart, overallEnd) + 1;
  
  if (isNaN(totalDuration) || totalDuration <= 0) {
    return <div className="h-10 bg-gray-200 rounded-md text-xs flex items-center justify-center text-red-500">Erro: Duração total inválida.</div>;
  }
  
  let lclHighlightStyles: React.CSSProperties = { display: 'none' };
  if (longestContinuousLeave && longestContinuousLeave.startDate && longestContinuousLeave.endDate && longestContinuousLeave.totalDays > 0) {
    const lclStartDate = longestContinuousLeave.startDate;
    const lclEndDate = longestContinuousLeave.endDate;

    // Ensure LCL dates are within the overall timeline bounds for calculation
    const effectiveLclStart = new Date(Math.max(overallStart.getTime(), lclStartDate.getTime()));
    const effectiveLclEnd = new Date(Math.min(overallEnd.getTime(), lclEndDate.getTime()));
    
    if (effectiveLclStart <= effectiveLclEnd) {
        const lclStartOffsetDays = differenceInDays(overallStart, effectiveLclStart);
        // Duration of the LCL part that is visible on the timeline
        const lclVisibleDurationDays = differenceInDays(effectiveLclStart, effectiveLclEnd) + 1;

        if (lclVisibleDurationDays > 0) {
            const highlightLeftPercentage = (lclStartOffsetDays / totalDuration) * 100;
            const highlightWidthPercentage = (lclVisibleDurationDays / totalDuration) * 100;

            lclHighlightStyles = {
                display: 'block',
                position: 'absolute',
                top: '0px', // Align with parent padding
                left: `${Math.max(0, Math.min(100 - highlightWidthPercentage, highlightLeftPercentage))}%`, // Ensure it doesn't overflow if LCL is wider than timeline
                width: `${Math.max(0, Math.min(100, highlightWidthPercentage))}%`,
                height: '100%', // Align with parent padding
                // boxSizing: 'border-box', // Tailwind handles this with border utilities
            };
        }
    }
  }


  return (
    <div className="w-full bg-gray-100 rounded-md p-1 flex relative h-10 shadow">
      {segments.map((segment) => {
        if (segment.durationDays <= 0) {
          return null; 
        }

        const widthPercentage = (segment.durationDays / totalDuration) * 100;
        
        if (isNaN(widthPercentage) || widthPercentage < 0) {
          return null; 
        }
        
        let bgColor = '';
        switch (segment.type) {
          case 'covered': bgColor = 'bg-green-500'; break;
          case 'overlapping': bgColor = 'bg-yellow-400'; break;
          case 'gap': bgColor = 'bg-red-500'; break;
        }
        
        return (
          <Tooltip 
            key={segment.id} 
            text={segment.tooltip} 
            position="top"
            className="h-full" 
            style={{ width: `${Math.max(0, widthPercentage)}%` }}
          >
            <div
              className={`w-full h-full ${bgColor} transition-all duration-300 ease-in-out`}
            />
          </Tooltip>
        );
      })}
       {/* LCL Highlight Overlay */}
       {lclHighlightStyles.display === 'block' && (
        <div
          className="absolute border-2 border-blue-500 rounded-md pointer-events-none z-10"
          style={lclHighlightStyles}
          aria-label="Maior Afastamento Contínuo"
        ></div>
      )}
    </div>
  );
};


const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ certificates, analysisResults, onRemoveCertificate, onEditCertificate, onNewAnalysis }) => {
  const overallStartDate = analysisResults?.allDates && analysisResults.allDates.length > 0 ? analysisResults.allDates[0] : null;
  const overallEndDate = analysisResults?.allDates && analysisResults.allDates.length > 0 ? analysisResults.allDates[analysisResults.allDates.length - 1] : null;

  return (
    <div className="space-y-8">
      {/* Analysis Results Section */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Resultado da Análise</h2>
            <Tooltip text="Atenção: operação exclui todos os dados inseridos!">
                <button
                onClick={onNewAnalysis}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 ease-in-out transform hover:scale-105"
                >
                Nova Análise
                </button>
            </Tooltip>
        </div>

        {analysisResults ? (
          <div className="space-y-6">
            <div className="p-6 rounded-lg shadow-inner bg-blue-50 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-700 mb-1">Maior Afastamento Contínuo</h3>
              {analysisResults.longestContinuousLeave.startDate && analysisResults.longestContinuousLeave.endDate ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
                  <div>
                    <p className="text-sm text-blue-600">Data de Início</p>
                    <p className="text-2xl font-bold text-blue-800">{formatDate(analysisResults.longestContinuousLeave.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600">Data de Término</p>
                    <p className="text-2xl font-bold text-blue-800">{formatDate(analysisResults.longestContinuousLeave.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600">Total de Dias</p>
                    <p className="text-2xl font-bold text-blue-800">{analysisResults.longestContinuousLeave.totalDays}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Nenhum afastamento contínuo identificado.</p>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard title="Total de Atestados" value={analysisResults.totalCertificates} colorClass="bg-indigo-50" />
              <StatCard title="Sequências Contínuas" value={analysisResults.continuousSequenceCount} colorClass="bg-green-50" />
              <StatCard title="Atestados Sobrepostos" value={analysisResults.overlappingCertificatesCount} colorClass="bg-yellow-50" />
              <StatCard title="Dias Não Cobertos" value={analysisResults.totalNonCoveredDaysInGaps} colorClass="bg-red-50" />
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic">Nenhum atestado adicionado ou análise ainda não processada.</p>
        )}
      </div>

      {/* Timeline Section */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Linha do Tempo</h2>
        {analysisResults && overallStartDate && overallEndDate && overallStartDate instanceof Date && overallEndDate instanceof Date && !isNaN(overallStartDate.getTime()) && !isNaN(overallEndDate.getTime()) ? (
          <>
            <div className="flex justify-between text-xs text-gray-600 mb-1 px-1">
              <span>{formatDate(overallStartDate)}</span>
              <span>{formatDate(overallEndDate)}</span>
            </div>
            <TimelineBar 
              segments={analysisResults.timelineSegments} 
              overallStart={overallStartDate} 
              overallEnd={overallEndDate}
              longestContinuousLeave={analysisResults.longestContinuousLeave}
            />
            <div className="flex space-x-4 mt-3 text-xs justify-center flex-wrap">
              <div className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-sm mr-1 shrink-0"></span>Dias Cobertos</div>
              <div className="flex items-center"><span className="w-3 h-3 bg-yellow-400 rounded-sm mr-1 shrink-0"></span>Dias Sobrepostos</div>
              <div className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded-sm mr-1 shrink-0"></span>Dias Não Cobertos</div>
              <div className="flex items-center"><span className="w-3 h-3 border-2 border-blue-500 rounded-sm mr-1 shrink-0"></span>Maior Afastamento Contínuo</div>
            </div>
            {certificates.length > 0 && (
                <div className="mt-4 pt-3 border-t">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Períodos dos Atestados:</h4>
                    <ul className="text-xs text-gray-500 space-y-1">
                    {certificates.map(cert => (
                        <li key={cert.id}>
                        <span className="font-medium text-gray-700">#{cert.displayId}:</span> {formatDate(cert.startDate)} a {formatDate(cert.endDate)} ({cert.days} dias)
                        </li>
                    ))}
                    </ul>
                </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 italic">Adicione atestados para visualizar a linha do tempo.</p>
        )}
      </div>

      {/* Registered Certificates Table */}
      <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-200 overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Atestados Registrados</h2>
        {certificates.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Início</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Término</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dias</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{cert.displayId}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(cert.startDate)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(cert.endDate)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{cert.days}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        cert.status === CertificateStatus.CONTINUOUS ? 'bg-green-100 text-green-800' :
                        cert.status === CertificateStatus.NON_CONTINUOUS ? 'bg-red-100 text-red-800' :
                        cert.status === CertificateStatus.OVERLAPPING ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800' // For FIRST or undefined
                    }`}>
                        {cert.status || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <Tooltip text="Editar este atestado" position="top">
                        <button 
                            onClick={() => onEditCertificate(cert.id)}
                            className="text-blue-600 hover:text-blue-800 transition-colors mr-3"
                            aria-label={`Editar atestado #${cert.displayId}`}
                        >
                            Editar
                        </button>
                    </Tooltip>
                    <Tooltip text="Remover este atestado" position="top">
                        <button 
                            onClick={() => onRemoveCertificate(cert.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            aria-label={`Remover atestado #${cert.displayId}`}
                        >
                            Remover
                        </button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 italic">Nenhum atestado registrado.</p>
        )}
      </div>
    </div>
  );
};

export default AnalysisDisplay;
