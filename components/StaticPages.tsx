import React, { useState } from 'react';
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
  const authorImageUrl = "https://i.ibb.co/sJJyFm8q/Minha-Foto.jpg";

  return (
    <PageContainer title="🩺 Atestado e Perícia Médica - O Autor">
      <div className="float-right ml-6 mb-4 w-40 sm:w-48">
        <img src={authorImageUrl} alt="Dr. José Luiz de Souza Neto" className="w-full h-auto rounded-lg shadow-lg border" />
      </div>
      <p>Olá, seja muito bem-vindo(a) ao meu site, Atestado e Perícia Médica! Eu sou Dr. José Luiz (CRM/RN 4271), médico cirurgião com uma jornada dedicada à Cirurgia Geral, Videolaparoscopia, Perícia Médica Previdenciária e ao ensino na Universidade Federal do Rio Grande do Norte (UFRN). Tenho Mestrado em Ensino na Saúde e Pós-graduação em Perícia Médica. Atuo como Perito Médico Federal no Instituto Nacional do Seguro Social (INSS).</p>
      <p>Ao longo de mais de duas décadas de experiência, especialmente como Perito Previdenciário no INSS, percebi que muitos trabalhadores enfrentam dificuldades para entender seus direitos e deveres em relação a atestados médicos. Essa observação me motivou a criar uma solução prática e acessível: o site Atestado e Perícia Médica, onde você pode aumentar seu conhecimento no assunto, seja para concursos, para problemas enfrentados por você, por um familiar ou amigo. Aqui você terá um ambiente seguro e confiável para tirar dúvidas comigo ou com a assistente de IA que criei "A Perícia", também será possível discutir com outras pessoas assuntos relacionados.</p>
      <p>Minha experiência em perícia médica e a paixão por desenvolver tecnologias aplicadas à educação e saúde se uniram na criação deste site. Meu objetivo é simples: oferecer informação clara e direta para que você possa entender seus direitos, evitar interpretações errôneas e ter acesso facilitado ao que lhe é devido.</p>
      <p>Explore o site, utilize livremente a Calculadora de Atestado e, se surgir alguma pergunta, a página de Perguntas e Respostas está aqui para conversarmos e esclarecermos suas dúvidas. Espero que sua experiência por aqui seja útil e informativa!</p>
      
      <div className="mt-6 p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-400">
          <h3 className="text-xl font-bold text-yellow-800 mt-0 mb-3 flex items-center">
              <span className="text-2xl mr-3">⚠️</span>Aviso Importante
          </h3>
          <p className="text-yellow-900">As informações aqui visam apenas colaborar como informação e educação previdenciária e que jamais têm a pretenção de gerar garantias na obtenção de benefícios. A análise de cada caso é atribuição exclusiva da Perícia Médica Federal que atua no INSS, de forma que as informações obtidas neste site servem apenas de auxílio e orientação para que o cidadão conheça os seus direitos e saiba os caminhos para buscá-los.</p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">🎯 O Aplicativo Calculadora de Atestado - O que ele faz?</h2>
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
              <h3 className="text-xl font-semibold text-gray-800 mt-1 mb-2">Versão 6.0</h3>
              <p className="text-sm text-gray-500 mb-2"><em>Lançamento: Agosto de 2024</em></p>
              <ul className="list-disc list-inside space-y-1 text-base">
                <li><strong>Identidade Visual:</strong> O ícone da aplicação no cabeçalho foi substituído por um novo logotipo.</li>
                <li><strong>Rodapé:</strong> O nome do site foi atualizado para "Site Atestado e Perícia Médica" e a versão foi incrementada.</li>
                <li><strong>Página Sobre:</strong> Corrigida a exibição da foto do autor, que não estava aparecendo, e atualizado um dos títulos da seção. O histórico de versões agora reflete estas últimas melhorias.</li>
                <li><strong>Página de Privacidade:</strong> Textos atualizados para refletir o nome completo do site e do aplicativo.</li>
                <li><strong>Página de Contato:</strong> Melhorada a funcionalidade de contato em computadores, evitando redirecionamentos automáticos e exibindo o e-mail de forma clara para o usuário.</li>
              </ul>
            </div>
            {/* Adicionar futuras versões aqui */}
          </div>
        )}
      </div>
    </PageContainer>
  );
};


export const PrivacyPolicyPage: React.FC = () => (
    <PageContainer title="⚖️ Política de Privacidade – Site Atestado e Perícia Médica, Aplicativo Calculadora de Atestado">
        <p>O Site Atestado e Perícia Médica e o Aplicativo Calculadora de Atestado respeitam a privacidade dos usuários e seguem a Lei Geral de Proteção de Dados (LGPD), Lei nº 13.709/2018.</p>
        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">🔒 Coleta e Uso de Dados</h2>
        <p>Não coletamos, armazenamos ou compartilhamos dados pessoais dos usuários. Todas as informações inseridas são processadas localmente no seu dispositivo e são apagadas ao fechar ou atualizar a página.</p>
        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">🎯 Objetivo do Site Atestado e Perícia Médica e do Aplicativo Calculadora de Atestado</h2>
        <p>A ferramenta tem finalidade educacional e informativa, visando auxiliar no entendimento dos direitos relacionados a atestados médicos e benefícios previdenciários. Os resultados não têm valor legal e não substituem a análise pericial oficial do INSS ou a orientação de profissionais de direito.</p>
        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">📢 Publicidade</h2>
        <p>O site pode exibir anúncios do Google AdSense para cobrir custos de manutenção. O Google utiliza cookies para personalizar os anúncios com base nos seus interesses. Você pode gerenciar suas preferências de anúncios nas configurações da sua conta Google.</p>
        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">🔄 Alterações na Política</h2>
        <p>Esta política pode ser atualizada. Recomendamos a revisão periódica. O uso contínuo do site após alterações implica na aceitação dos novos termos.</p>
        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">📧 Contato</h2>
        <p>Para dúvidas sobre esta política, entre em contato através do e-mail disponibilizado na seção <Link to="/contato" className="text-blue-600 hover:underline">Contato</Link>.</p>
    </PageContainer>
);


export const ContactPage: React.FC = () => {
  const email = "joseluiz.neto@ufrn.br";
  const subject = "Contato sobre o Site Atestado e Perícia Médica";
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset message after 2 seconds
    });
  };

  return (
    <PageContainer title="✉️ Contato">
      <p>Para dúvidas, sugestões ou colaborações, entre em contato com o desenvolvedor, Dr. José Luiz de Souza Neto, através do e-mail abaixo. Sua mensagem é muito bem-vinda!</p>
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg border">
        <p className="text-sm text-gray-600 mb-2">Endereço de e-mail para contato:</p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a href={mailtoLink} className="font-mono text-lg text-blue-700 hover:underline break-all">{email}</a>
          <button 
            onClick={handleCopy}
            className="px-4 py-2 text-sm font-semibold text-white bg-gray-600 hover:bg-gray-700 rounded-md shadow-sm transition-colors w-full sm:w-auto"
            aria-live="polite"
          >
            {copied ? 'Copiado!' : 'Copiar E-mail'}
          </button>
        </div>
      </div>

      <a 
        href={mailtoLink} 
        className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
      >
        Abrir no seu aplicativo de e-mail
      </a>

      <div className="mt-8 p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
        <h3 className="font-bold">Sem cliente de e-mail configurado?</h3>
        <p className="text-sm mt-1">Se o botão "Abrir no seu aplicativo de e-mail" não funcionar, seu dispositivo pode não ter um programa de e-mail padrão. Nesse caso, use o botão "Copiar E-mail" e cole o endereço no seu webmail (Gmail, Outlook, etc.).</p>
      </div>
    </PageContainer>
  );
};

export const INSSPage: React.FC<{ onOpenGuide: () => void }> = ({ onOpenGuide }) => (
  <PageContainer title="📄 Benefício por Incapacidade Temporária (Antigo Auxílio-Doença)">
    <p>O Benefício por Incapacidade Temporária, conhecido anteriormente como Auxílio-Doença, é um direito do trabalhador segurado pelo INSS que se encontra temporariamente incapacitado para suas atividades laborais por motivo de doença ou acidente.</p>
    
    <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">✅ Quem tem direito?</h2>
    <p>Para ter direito ao benefício, o trabalhador precisa cumprir alguns requisitos essenciais:</p>
    <ul className="list-disc list-inside space-y-2 mt-2">
      <li><strong>Afastamento superior a 15 dias:</strong> A incapacidade para o trabalho deve ser superior a 15 dias consecutivos. Para empregados de carteira assinada, os primeiros 15 dias são pagos pela empresa, e o INSS é responsável a partir do 16º dia.</li>
      <li><strong>Qualidade de segurado:</strong> É preciso estar contribuindo para o INSS ou estar no "período de graça" (tempo que mantém a qualidade de segurado mesmo sem contribuir).</li>
      <li><strong>Carência:</strong> Geralmente, é necessário ter contribuído por no mínimo 12 meses antes do início da incapacidade. Essa carência é dispensada em casos de acidente de qualquer natureza (incluindo o de trabalho) ou de doenças graves especificadas em lei.</li>
    </ul>

    <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">📋 Documentos Essenciais para a Perícia</h2>
    <p>A preparação correta da documentação é fundamental para o sucesso do seu pedido. No dia da perícia, leve os seguintes documentos originais:</p>
    <ul className="list-disc list-inside space-y-2 mt-2">
      <li>Documento de identificação oficial com foto (RG, CNH).</li>
      <li>CPF.</li>
      <li>Carteira de Trabalho e Previdência Social (CTPS), carnês de contribuição ou outros documentos que comprovem o pagamento ao INSS.</li>
      <li><strong>Documentação Médica:</strong> Atestados, laudos, relatórios e exames recentes que comprovem a sua condição de saúde e a incapacidade para o trabalho. O atestado deve ser legível, conter o CID (Classificação Internacional de Doenças), data, assinatura e carimbo do médico.</li>
      <li>Comunicação de Acidente de Trabalho (CAT), se o afastamento for decorrente de um acidente de trabalho.</li>
      <li>Declaração carimbada e assinada do empregador, informando a data do último dia trabalhado (para segurados empregados).</li>
    </ul>

    <div className="mt-8 p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400 text-blue-800">
      <h3 className="font-bold">Como Agendar sua Perícia?</h3>
      <p className="mt-2">O agendamento é o primeiro passo para solicitar seu benefício. Você pode fazer isso online pelo portal Meu INSS ou pelo telefone 135. Para facilitar, preparamos um guia passo a passo.</p>
      <button
        onClick={onOpenGuide}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-transform transform hover:scale-105"
      >
        Ver Guia de Agendamento
      </button>
    </div>
  </PageContainer>
);