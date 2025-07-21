import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdSense from './AdSense';

const PageContainer: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
  <div className="max-w-4xl mx-auto p-6 md:p-10 bg-white shadow-xl rounded-lg my-8 border border-gray-200">
    <h1 className="text-3xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-300">{title}</h1>
    <div className="prose prose-lg max-w-none text-gray-700">
        {children}
    </div>
    <Link to="/" className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out transform hover:scale-105">
      Voltar para a página inicial
    </Link>
  </div>
);

export const AboutPage: React.FC = () => {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  return (
    <PageContainer title="🩺 Tempo de Atestado — O que é?">
      <p>O Tempo de Atestado é um aplicativo gratuito e online criado pelo Dr. José Luiz de Souza Neto (CRM/RN 4271), médico cirurgião com ampla experiência em Cirurgia Geral, Cirurgia Videolaparoscópica, Perícia Médica e Ensino Médico. Professor da Universidade Federal do Rio Grande do Norte (UFRN), Dr. José Luiz também é criador de simuladores médicos e tecnologias aplicadas à educação e à saúde.</p>
      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">🎯 Objetivo</h2>
      <p>Esta ferramenta foi desenvolvida com o propósito de democratizar o acesso ao cálculo correto e atualizado do tempo de afastamento por atestado médico, considerando a legislação brasileira vigente. Ao automatizar e simplificar esse processo, o app contribui para evitar prejuízos, atrasos e inconsistências na gestão de atestados.</p>
      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">👥 Quem pode se beneficiar?</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>Pacientes, trabalhadores e segurados do INSS ou de Seguradoras Privadas;</li>
        <li>Empregadores e Setores de RH;</li>
        <li>Advogados e peritos judiciais;</li>
        <li>Estudantes e profissionais da saúde;</li>
        <li>Instituições públicas e privadas.</li>
      </ul>
      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">⚙️ Como funciona?</h2>
      <p>O usuário insere a data de início e a quantidade de dias ou data de término indicados no atestado. O aplicativo realiza o cálculo do tempo total de afastamento, organiza os atestados, identifica sobreposições, períodos não cobertos e o maior período de afastamento contínuo.</p>
      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">🤝 Como colaborar com o projeto?</h2>
      <p>Este app é gratuito e independente. Sugestões, correções ou ideias para funcionalidades podem ser enviadas ao desenvolvedor por e-mail. Vide <Link to="/contato" className="text-blue-600 hover:underline">Contato</Link> no rodapé da página principal.</p>

      {/* Collapsible Version History Section */}
      <div className="mt-8 pt-6 border-t border-gray-300">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Histórico de Versões</h2>
        <button
          onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
          className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none mb-3"
          aria-expanded={isHistoryExpanded}
          aria-controls="version-history-content"
        >
          {isHistoryExpanded ? 'Mostrar menos' : 'Mostrar mais'}
        </button>
        
        {isHistoryExpanded && (
          <div id="version-history-content" className="pl-2 space-y-6">
             <div>
              <h3 className="text-xl font-semibold text-gray-800 mt-1 mb-2">Versão 5.5</h3>
              <p className="text-sm text-gray-500 mb-2"><em>Lançamento: Julho de 2024</em></p>
              <ul className="list-disc list-inside space-y-1 text-base">
                <li><strong>Integração com INSS:</strong> O aplicativo agora orienta ativamente sobre o Benefício por Incapacidade Temporária.</li>
                 <ul className="list-[circle] list-inside ml-5 space-y-1">
                    <li><strong>Página "Benefício INSS":</strong> Nova seção informativa acessível pelo rodapé, com detalhes sobre o benefício, requisitos, prazos e documentação.</li>
                    <li><strong>Card de Ação Dinâmico:</strong> Um alerta é exibido na página de resultados se o afastamento contínuo for maior que 15 dias, informando o prazo para requerer o benefício junto ao INSS.</li>
                    <li><strong>Guia Visual para Agendamento:</strong> Um modal interativo ensina o passo a passo para agendar a perícia no site Meu INSS.</li>
                 </ul>
                <li><strong>Melhora de Usabilidade:</strong> Agora é possível adicionar um atestado pressionando a tecla "Enter" após preencher as datas, agilizando a inserção de dados.</li>
                <li><strong>Ajustes de Layout:</strong> Padronização dos textos e alinhamento dos botões de ação relacionados ao INSS para maior clareza e consistência visual.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mt-1 mb-2">Versão 5.0</h3>
              <p className="text-sm text-gray-500 mb-2"><em>Lançamento: Julho de 2024</em></p>
              <ul className="list-disc list-inside space-y-1 text-base">
                <li><strong>Página Inicial:</strong> Conteúdo da seção "Informações sobre o uso da ferramenta" completamente revisado e expandido, oferecendo um guia detalhado sobre como utilizar todas as funcionalidades do aplicativo, incluindo a interpretação da linha do tempo e dicas importantes.</li>
                <li><strong>Aparência:</strong> Uniformização da formatação de textos e ícones nas páginas "Inicial", "Sobre" e "Política de Privacidade", garantindo maior consistência visual e profissionalismo.</li>
                <li><strong>Cabeçalho da Página Inicial:</strong> Refinamento no design do cabeçalho principal, assegurando que o título e subtítulo se destaquem sobre um fundo azul, conforme a paleta do aplicativo.</li>
                <li><strong>Rodapé:</strong> Revisão e confirmação do link "Início" para navegação facilitada e atualização do número da versão da aplicação para 5.0.</li>
                <li><strong>Política de Privacidade:</strong> Implementada a exibição dinâmica da data de "Última atualização", assegurando que a informação esteja sempre correta.</li>
                <li><strong>Página Sobre:</strong> Adicionada esta seção "Histórico de Versões" para que os usuários possam acompanhar as evoluções e melhorias implementadas em cada atualização do aplicativo. Modificada a forma de expandir/recolher para usar links "Mostrar mais/menos".</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mt-1 mb-2">Versão 3.0 (e anteriores)</h3>
              <p className="text-sm text-gray-500 mb-2"><em>Lançamentos anteriores</em></p>
              <ul className="list-disc list-inside space-y-1 text-base">
                <li>Melhorias incrementais na interface do usuário, lógica de cálculo de atestados e usabilidade geral.</li>
                <li>Estruturação inicial do aplicativo com funcionalidades de adição, edição e remoção de atestados.</li>
                <li>Implementação da análise de sobreposições, identificação de lacunas entre atestados e cálculo do maior período de afastamento contínuo.</li>
                <li>Criação das páginas estáticas "Sobre", "Política de Privacidade" e funcionalidade de "Contato".</li>
                <li>Otimizações de performance e correções de bugs menores.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="my-8 not-prose">
          <AdSense
              adClient="ca-pub-2071700067184743"
              adSlot="YOUR_AD_SLOT_ID_HERE_ABOUT"
          />
      </div>
    </PageContainer>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  const today = new Date();
  const lastUpdatedDate = today.toLocaleDateString('pt-BR', {
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  });

  return (
    <PageContainer title="🔐 Política de Privacidade – Tempo de Atestado">
      <p className="text-sm text-gray-500 mb-4">Última atualização: {lastUpdatedDate}</p>
      <p>O aplicativo Tempo de Atestado respeita a privacidade dos usuários e segue a Lei Geral de Proteção de Dados (LGPD), Lei nº 13.709/2018.</p>
      <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-2">Coleta de Dados:</h3>
      <p>Nenhum dado pessoal (como nome, CPF, etc.) é solicitado, coletado ou armazenado permanentemente nos nossos servidores. Os dados dos atestados (datas e dias de afastamento) são processados localmente no seu navegador (client-side) para realizar os cálculos. Esses dados são perdidos ao fechar ou recarregar a página, a menos que explicitamente salvos pelo usuário através de funcionalidades futuras (não implementadas atualmente).</p>
      <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-2">Cookies e Tecnologias de Rastreamento:</h3>
      <p>O site pode utilizar cookies essenciais para o funcionamento básico da aplicação. Podemos usar o Google Analytics para coletar informações anônimas sobre o uso do site (como páginas visitadas, tempo de permanência), o que nos ajuda a melhorar a ferramenta. O Google AdSense pode ser usado para exibir anúncios, e este serviço utiliza cookies para personalizar os anúncios exibidos. Você pode gerenciar suas preferências de cookies e anúncios nas configurações do seu navegador ou através das ferramentas de opt-out do Google.</p>
      <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-2">Compartilhamento de Dados:</h3>
      <p>Não compartilhamos os dados de cálculo inseridos pelos usuários com terceiros, pois estes são processados localmente. Informações agregadas e anônimas de uso (via Google Analytics) podem ser usadas para fins estatísticos.</p>
      <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-2">Objetivo do App:</h3>
      <p>O Tempo de Atestado tem fins informativos e educacionais. Ele visa auxiliar no cálculo e na visualização de períodos de afastamento. Não substitui aconselhamento médico, jurídico ou pericial profissional. As interpretações e decisões baseadas nos resultados são de responsabilidade do usuário.</p>
      <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-2">Contato:</h3>
      <p>Para dúvidas ou sugestões sobre esta política de privacidade, entre em contato: <a href="mailto:joseluizmed@gmail.com?subject=Política de Privacidade - Tempo de Atestado" className="text-blue-600 hover:underline">joseluizmed@gmail.com</a>.</p>
      <div className="my-8 not-prose">
            <AdSense
                adClient="ca-pub-2071700067184743"
                adSlot="YOUR_AD_SLOT_ID_HERE_PRIVACY"
            />
        </div>
    </PageContainer>
  );
};

export const ContactPage: React.FC = () => {
  useEffect(() => {
    window.location.href = "mailto:joseluizmed@gmail.com?subject=Sugestão para o aplicativo Tempo de Atestado";
  }, []);

  return (
    <PageContainer title="Contato">
      <p>Você está sendo redirecionado para o seu cliente de e-mail para enviar uma mensagem para <strong>joseluizmed@gmail.com</strong> com o assunto "Sugestão para o aplicativo Tempo de Atestado".</p>
      <p className="mt-4">Se o redirecionamento não funcionar, por favor, copie o endereço de e-mail e envie sua mensagem manualmente.</p>
      <p className="mt-4"><a href="mailto:joseluizmed@gmail.com?subject=Sugestão para o aplicativo Tempo de Atestado" className="text-blue-600 hover:underline">Clique aqui se não for redirecionado.</a></p>
    </PageContainer>
  );
};

export const INSSPage: React.FC<{onOpenGuide: () => void}> = ({ onOpenGuide }) => {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-10 bg-white shadow-xl rounded-lg my-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-300">📄 Benefício por Incapacidade Temporária (Auxílio-Doença)</h1>
        <div className="prose prose-lg max-w-none text-gray-700">
            <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">O que é?</h2>
            <p>É um benefício devido ao segurado do INSS que comprove, em perícia médica, estar temporariamente incapaz para o trabalho em decorrência de doença ou acidente.</p>
            <p className="mt-2">A regra geral é que os primeiros 15 dias de afastamento são pagos pela empresa. A partir do 16º dia, a responsabilidade do pagamento passa a ser do INSS, desde que o benefício seja requerido e aprovado.</p>
            </section>
    
            <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Quem pode utilizar este serviço?</h2>
            <p>Para ter direito ao benefício, o trabalhador precisa atender aos seguintes requisitos:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Comprovar incapacidade temporária para o trabalho em perícia médica.</li>
                <li>Possuir a "qualidade de segurado" na data do início da incapacidade.</li>
                <li>Ter contribuído para a Previdência Social por pelo menos 12 meses (carência).</li>
            </ul>
            <p className="mt-2 text-sm text-gray-600"><strong>Exceção à Carência:</strong> Não é exigida carência para acidentes de qualquer natureza (incluindo de trabalho), ou para doenças especificadas na lista do Ministério da Saúde e do Trabalho e da Previdência.</p>
            </section>
    
            <section className="p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-400 my-8">
            <h2 className="text-2xl font-semibold text-yellow-800 mt-0 mb-3">🚨 Prazo Crítico para Solicitação</h2>
            <p className="text-yellow-900">Para garantir que o benefício seja pago desde a data do início do afastamento (o 16º dia), o requerimento deve ser feito <strong>em até 30 dias</strong> após o início da incapacidade.</p>
            <p className="mt-2 text-yellow-900">Se o pedido for feito após o 30º dia, o pagamento será efetuado a partir da data do requerimento, e não mais da data do afastamento, <strong>resultando em perda financeira.</strong></p>
            </section>
    
            <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Documentação Necessária</h2>
            <p>No dia da perícia, tenha em mãos:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Documento de identificação oficial com foto.</li>
                <li>CPF.</li>
                <li>Carteira de trabalho e/ou outros documentos que comprovem pagamento ao INSS.</li>
                <li>Atestado médico, laudos, exames, receitas e outros documentos que comprovem a incapacidade.</li>
                <li>(Para empregados) Declaração da empresa informando o último dia trabalhado.</li>
            </ul>
            </section>

            <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Etapas para a realização deste serviço</h2>
            <ol className="list-decimal list-inside space-y-2 mt-2">
                <li><strong>Agendamento:</strong> Solicite o benefício pelos canais de atendimento.</li>
                <li><strong>Comparecimento:</strong> Vá à agência do INSS na data e hora marcadas para a perícia médica.</li>
                <li><strong>Acompanhamento:</strong> Consulte o resultado da perícia e o andamento do seu pedido pelo Meu INSS ou pelo telefone 135.</li>
            </ol>
            </section>
    
            <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">Canais de Prestação</h2>
            <p>Você pode solicitar e acompanhar seu benefício através dos seguintes canais:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Aplicativo Meu INSS:</strong> <a href="https://play.google.com/store/apps/details?id=br.gov.dataprev.meuinss" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Play</a> | <a href="https://apps.apple.com/br/app/meu-inss-central-de-serviços/id1243048358" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">App Store</a></li>
                <li><strong>Site:</strong> <a href="https://meu.inss.gov.br" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">meu.inss.gov.br</a></li>
                <li><strong>Telefone:</strong> 135 (de segunda a sábado, das 7h às 22h).</li>
            </ul>
            </section>

            <div className="my-8 not-prose">
              <AdSense
                  adClient="ca-pub-2071700067184743"
                  adSlot="YOUR_AD_SLOT_ID_HERE_INSS"
              />
            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-300 flex flex-col sm:flex-row gap-4">
            <a href="tel:135" className="flex-1 text-center bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-5 rounded-md shadow-md transition duration-150 ease-in-out no-underline">
                Agendamento por Telefone - 135
            </a>
            <button 
                onClick={onOpenGuide}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-md shadow-md transition duration-150 ease-in-out">
                Agendamento On-line da Perícia
            </button>
        </div>
         <Link to="/" className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out transform hover:scale-105">
          Voltar para a página inicial
        </Link>
      </div>
    );
  };
