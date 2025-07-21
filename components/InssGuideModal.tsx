import React from 'react';

interface InssGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InssGuideModal: React.FC<InssGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }
  
  // Base64 encoded SVG of a button that looks like the "Entrar com gov.br" button
  const imageUrl = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjU2IiB2aWV3Qm94PSIwIDAgMjgwIDU2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iNTYiIHJ4PSI4IiBmaWxsPSIjMDM2YWJkIi8+PHRleHQgeD0iMTQwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjcwMCI+RW50cmFyIGNvbSBnb3YuYnI8L3RleHQ+PC9zdmc+";

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      aria-labelledby="inss-guide-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-transform duration-300 scale-95 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 id="inss-guide-title" className="text-xl font-bold text-gray-800">Guia: Agendando sua Perícia</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fechar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </header>

        <main className="p-6 overflow-y-auto">
          <div className="flex justify-center mb-6">
            <img src={imageUrl} alt="Botão Entrar com gov.br" className="rounded-lg shadow-md border" />
          </div>

          <h3 className="text-lg font-semibold text-gray-700 mb-3">Siga os passos no site do Meu INSS:</h3>
          <ol className="list-decimal list-inside space-y-3 text-gray-600 prose prose-lg max-w-none">
            <li>Acesse o site <a href="https://meu.inss.gov.br" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Meu INSS</a> e clique em <strong>"Entrar com gov.br"</strong>.</li>
            <li>Faça o login com seu CPF e senha da conta gov.br.</li>
            <li>Na tela inicial, procure pela opção <strong>"Pedir Benefício por Incapacidade"</strong>.</li>
            <li>Selecione "Benefício por Incapacidade Temporária (Auxílio-Doença)" e clique em "Novo Requerimento".</li>
            <li>Anexe seus documentos médicos digitalizados (atestados, laudos, exames).</li>
            <li>Siga as instruções para escolher a agência do INSS, a data e o horário para a perícia médica presencial.</li>
            <li>Confirme o agendamento e salve o comprovante gerado.</li>
          </ol>
        </main>

        <footer className="flex flex-col sm:flex-row-reverse justify-between items-center p-5 bg-gray-50 border-t border-gray-200 rounded-b-lg gap-3">
          <a
            href="https://meu.inss.gov.br/#/login?redirectUrl=/agende-pericia"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out transform hover:scale-105 text-center"
          >
            Ir para o site do INSS
          </a>
          <button
            onClick={onClose}
            className="w-full sm:w-auto mt-2 sm:mt-0 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Fechar
          </button>
        </footer>
      </div>
      <style>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default InssGuideModal;
