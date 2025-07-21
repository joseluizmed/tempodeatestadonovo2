import React, { useEffect, useRef } from 'react';

const GiscusComponent: React.FC = () => {
  const giscusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Garante que o contêiner de referência exista
    if (!giscusRef.current) return;
    
    // Limpa instâncias anteriores do giscus para evitar duplicatas ao navegar
    // entre páginas no cliente (React Router)
    while(giscusRef.current.firstChild) {
      giscusRef.current.removeChild(giscusRef.current.firstChild);
    }

    // Cria o elemento de script do Giscus
    const script = document.createElement('script');
    script.src = "https://giscus.app/client.js";
    
    // --- IMPORTANTE: CONFIGURE SEU REPOSITÓRIO GISCUS AQUI ---
    // Você pode obter esses valores na página de configuração do Giscus: https://giscus.app
    // Substitua os valores de exemplo pelos seus.
    script.setAttribute("data-repo", "josesneto/tempo-de-atestado"); 
    script.setAttribute("data-repo-id", "R_kgDOMGV42w");
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", "DIC_kwDOMGV4284Chz8Q");
    // --- FIM DA CONFIGURAÇÃO ---

    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "light"); // Opções: 'light', 'dark', 'preferred_color_scheme'
    script.setAttribute("data-lang", "pt");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    // Anexa o script configurado ao elemento de referência, o que fará o Giscus carregar
    giscusRef.current.appendChild(script);

  }, []); // O array vazio de dependências garante que este efeito seja executado apenas uma vez, quando o componente é montado.

  return <section ref={giscusRef} className="giscus-container mt-4" />;
};

export default GiscusComponent;
