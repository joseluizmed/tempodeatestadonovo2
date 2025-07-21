import React from 'react';
import { Link } from 'react-router-dom';
import { AnalysisResults } from '../types';
import { addDays, differenceInDays, formatDate } from '../utils/dateUtils';
import Tooltip from './Tooltip';

interface InssActionCardProps {
  analysisResults: AnalysisResults | null;
  onOpenGuide: () => void;
}

const InssActionCard: React.FC<InssActionCardProps> = ({ analysisResults, onOpenGuide }) => {
  if (!analysisResults || !analysisResults.longestContinuousLeave.endDate || analysisResults.longestContinuousLeave.totalDays <= 15) {
    return null;
  }

  const { endDate } = analysisResults.longestContinuousLeave;
  const deadline = addDays(endDate, 30);
  
  // Create a UTC date for 'today' to ensure a correct comparison
  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const daysRemaining = differenceInDays(todayUTC, deadline);

  let alertConfig: {
    bgColor: string;
    borderColor: string;
    textColor: string;
    icon: string;
    title: string;
    text: string;
  };

  if (daysRemaining < 0) {
    alertConfig = {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-800',
      icon: '🚨',
      title: 'Prazo Expirado',
      text: `O prazo de 30 dias para requerer o benefício sem perdas financeiras expirou em ${formatDate(deadline)}.`
    };
  } else if (daysRemaining <= 10) {
    alertConfig = {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-800',
      icon: '⚠️',
      title: 'Atenção!',
      text: `Restam apenas ${daysRemaining} dia${daysRemaining !== 1 ? 's' : ''} para solicitar o benefício e garantir o pagamento desde o início do afastamento. O prazo final é ${formatDate(deadline)}.`
    };
  } else {
    alertConfig = {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-800',
      icon: 'ℹ️',
      title: 'Prazo para Solicitação',
      text: `Você tem ${daysRemaining} dias restantes para solicitar o benefício sem perdas financeiras. O prazo para requerimento expira em ${formatDate(deadline)}.`
    };
  }

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg border-2 border-blue-600">
      <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
        <span className="text-2xl mr-3">❗</span>Ação Recomendada: Requerer Benefício INSS
      </h3>
      <p className="text-gray-600 mb-4">
        Seu maior período de afastamento contínuo ultrapassou 15 dias. Você pode ter direito ao Benefício por Incapacidade Temporária. Veja abaixo o seu prazo.
      </p>

      <div className={`p-4 rounded-md border ${alertConfig.borderColor} ${alertConfig.bgColor}`}>
        <p className={`font-bold ${alertConfig.textColor} flex items-center`}>
          <span className="text-xl mr-2">{alertConfig.icon}</span>{alertConfig.title}
        </p>
        <p className={`text-sm mt-1 ${alertConfig.textColor}`}>{alertConfig.text}</p>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
        <Tooltip text="Veja informações importantes sobre documentos e prazos antes de agendar.">
          <Link
            to="/beneficio-inss"
            className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md shadow-md transition duration-150 ease-in-out"
          >
            Veja antes de Agendar
          </Link>
        </Tooltip>
        
        <Tooltip text="Mostra um guia passo a passo antes de ir para o site.">
          <button
            onClick={onOpenGuide}
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md shadow-md transition duration-150 ease-in-out"
          >
            Agendamento On-line da Perícia
          </button>
        </Tooltip>

        <Tooltip text="Abre o teclado de discagem do seu celular.">
          <a
            href="tel:135"
            className="block w-full text-center bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-md shadow-md transition duration-150 ease-in-out"
          >
            Agendamento por Telefone - 135
          </a>
        </Tooltip>
      </div>
    </div>
  );
};

export default InssActionCard;
