import React, { useState } from 'react';
import AIAssistant from './AIAssistant';
import GiscusComponent from './GiscusComponent';

interface CommunityOrAIAssistantProps {
  contextTitle?: string;
}

const CommunityOrAIAssistant: React.FC<CommunityOrAIAssistantProps> = ({ contextTitle }) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'forum'>('ai');

  const tabBaseClasses = "flex-1 text-center font-semibold py-3 px-4 rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer";
  const activeTabClasses = "bg-white text-blue-700 border-b-0 shadow-sm";
  const inactiveTabClasses = "bg-slate-100 text-slate-600 hover:bg-slate-200 border-b";

  return (
    <div className="bg-slate-50 p-0 rounded-lg shadow-inner border border-slate-200">
      <div className="flex border-b border-slate-200 bg-slate-50 rounded-t-lg" role="tablist">
        <button
          onClick={() => setActiveTab('ai')}
          className={`${tabBaseClasses} ${activeTab === 'ai' ? activeTabClasses : inactiveTabClasses}`}
          aria-selected={activeTab === 'ai'}
          role="tab"
          id="ai-tab"
          aria-controls="ai-panel"
        >
          <span role="img" aria-label="robô" className="mr-2">🤖</span> Assistente de IA
        </button>
        <button
          onClick={() => setActiveTab('forum')}
          className={`${tabBaseClasses} ${activeTab === 'forum' ? activeTabClasses : inactiveTabClasses}`}
          aria-selected={activeTab === 'forum'}
          role="tab"
          id="forum-tab"
          aria-controls="forum-panel"
        >
          <span role="img" aria-label="balão de fala" className="mr-2">💬</span> Fórum da Comunidade
        </button>
      </div>

      <div className="p-6 bg-white rounded-b-lg">
        {activeTab === 'ai' && (
          <div role="tabpanel" id="ai-panel" aria-labelledby="ai-tab">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Assistente Virtual Especialista</h3>
            <p className="mb-4 text-gray-600 text-sm">
                Receba uma resposta instantânea e privada. Nossa IA foi treinada com base nos conhecimentos do Dr. José Luiz sobre perícia médica e benefícios do INSS. Nenhuma pergunta é armazenada.
            </p>
            <AIAssistant contextTitle={contextTitle} />
          </div>
        )}
        {activeTab === 'forum' && (
          <div role="tabpanel" id="forum-panel" aria-labelledby="forum-tab">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Participe da Discussão Pública</h3>
            <p className="mb-4 text-gray-600 text-sm">
              Converse com outros visitantes e com o Dr. José Luiz. 
              <strong> Para postar, é necessário se registrar no Giscus usando sua conta do GitHub.</strong>
              Suas perguntas e comentários ficarão visíveis para todos.
            </p>
            <GiscusComponent />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityOrAIAssistant;
