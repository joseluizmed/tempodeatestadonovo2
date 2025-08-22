


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
  const authorImageBase64 = `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUSEhIVFRUVFRUVFRUVFRUVFRUVFRUWFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGi0lHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAAEBQIDBgEABwj/xAA+EAACAQIEAwYDBgQEBwEBAAABAgMAEQQSITEFQVEGEyJhcYEykaEUQrHB0fBCUuEVIzOC8WJygpKy0uJD/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAECAwQF/8QAIxEAAgICAgICAwEAAAAAAAAAAAECEQMhEjEEQRMiUWFxMv/aAAwDAQACEQMRAD8A8XAoU4UldSMyRClFOApVADacKUUoUAIKUU4UooAYKUU4UooAYKUU4UooAYKUU4UooAYKUU4UooAYKUU4UooAYKUU4UooAYKUU4UooAYKUU4UooAYKUU4UooAYKUU4UooAYKUU4UooAYKUU4UooAYKKUUooAZSgU6lFABxSgU4ClAoAQClFOApQKAFApQKeBS0AJgUoFOApQKAFApwFOApQKAEApQKcBSgUAIApQKcBSgUAIBSgU4ClAoAQClApwFLQAoFOApwFLQAoFLTqUUAIBS06lFACgUtOpRQAgFLTqUUAIBS06lFACgUtOooAYKKKKAEooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiig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`;

  return (
    <PageContainer title="🩺 Tempo de Atestado — O que é?">
      <img src={authorImageBase64} alt="Dr. José Luiz de Souza Neto" className="float-right ml-6 mb-4 w-40 sm:w-48 h-auto rounded-lg shadow-lg border" />
      <p>Seja bem-vindo ao Tempo de Atestado! Eu sou Dr. José Luiz (CRM/RN 4271), médico cirurgião com uma jornada dedicada à Cirurgia Geral, Videolaparoscopia, Perícia Médica Previdenciária e ao ensino na Universidade Federal do Rio Grande do Norte (UFRN). Tenho Mestrado em Ensino na Saúde e Pós-graduação em Perícia Médica. Atuo como Perito Médico Federal no Instituto Nacional do Seguro Social (INSS).</p>
      <p>Ao longo de mais de duas décadas de experiência, especialmente como Perito Previdenciário no INSS, percebi que muitos trabalhadores enfrentam dificuldades para entender seus direitos e deveres em relação a atestados médicos. Essa observação me motivou a criar uma solução prática e acessível: o aplicativo 'Tempo de Atestado', que você pode usar gratuitamente na página inicial deste site.</p>
      <p>Minha experiência em perícia médica e a paixão por desenvolver tecnologias aplicadas à educação e saúde se uniram na criação desta ferramenta. Meu objetivo é simples: oferecer informação clara e direta para que você possa entender seus direitos, evitar interpretações errôneas e ter acesso facilitado ao que lhe é devido.</p>
      <p>Explore o site, utilize o aplicativo e, se surgir alguma pergunta, a página de Perguntas e Respostas está aqui para conversarmos e esclarecermos suas dúvidas. Espero que sua experiência por aqui seja útil e informativa!</p>
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

            <div className="p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-400 my-8 not-prose">
                <h3 className="text-xl font-bold text-yellow-800 mt-0 mb-3 flex items-center">
                    <span className="text-2xl mr-3">💡</span>Atenção: Início do Benefício
                </h3>
                <ul className="list-disc list-inside space-y-2 text-yellow-900">
                    <li>No caso do <strong>segurado empregado</strong> (trabalhador com carteira assinada), o benefício começa a contar do <strong>16º (décimo sexto) dia</strong> de afastamento do trabalho.</li>
                    <li>Os primeiros <strong>15 dias</strong> de afastamento do segurado empregado são de responsabilidade da <strong>empresa</strong>, que deve pagar o salário integral.</li>
                    <li>No caso dos <strong>demais segurados</strong> (contribuinte individual, facultativo, trabalhador avulso, etc.), o benefício contará a partir do <strong>primeiro dia da incapacidade</strong>.</li>
                </ul>
            </div>
    
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
    
            <section className="p-4 rounded-lg bg-red-50 border-l-4 border-red-400 my-8">
            <h2 className="text-2xl font-semibold text-red-800 mt-0 mb-3">🚨 Prazo Crítico para Solicitação</h2>
            <p className="text-red-900">Para garantir que o benefício seja pago desde a data do início do afastamento (o 16º dia), o requerimento deve ser feito <strong>em até 30 dias</strong> após o início da incapacidade.</p>
            <p className="mt-2 text-red-900">Se o pedido for feito após o 30º dia, o pagamento será efetuado a partir da data do requerimento, e não mais da data do afastamento, <strong>resultando em perda financeira.</strong></p>
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

            <details className="mt-8 pt-6 border-t border-gray-200 not-prose">
                <summary className="text-lg font-semibold text-gray-700 cursor-pointer hover:text-gray-900">
                    Fundamentação Legal
                </summary>
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 space-y-3">
                    <p><strong>Art. 60, da Lei 8.213/91.</strong> O auxílio-doença será devido ao segurado empregado a contar do décimo sexto dia do afastamento da atividade, e, no caso dos demais segurados, a contar da data do início da incapacidade e enquanto ele permanecer incapaz. (Redação dada pela Lei nº 9.876, de 26.11.99)</p>
                    <p><strong>§ 1º</strong> Quando requerido por segurado afastado da atividade por mais de 30 (trinta) dias, o auxílio-doença será devido a contar da data da entrada do requerimento.</p>
                    <p><strong>§ 3º</strong> Durante os primeiros quinze dias consecutivos ao do afastamento da atividade por motivo de doença, incumbirá à empresa pagar ao segurado empregado o seu salário integral. (Redação dada pela Lei nº 9.876, de 26.11.99)</p>
                    <p><strong>§ 4º</strong> A empresa que dispuser de serviço médico, próprio ou em convênio, terá a seu cargo o exame médico e o abono das faltas correpondentes ao período referido no § 3º, somente devendo encaminhar o segurado à perícia médica da Previdência Social quando a incapacidade ultrapassar 15 (quinze) dias.</p>
                </div>
            </details>
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