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
    script.setAttribute("data-repo", "joseluizmed/tempodeatestadonovo2"); 
    script.setAttribute("data-repo-id", "R_kgDOPP5azg");
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", "DIC_kwDOPP5azs4CtPj3");
    // --- FIM DA CONFIGURAÇÃO ---

    script.setAttribute("data-mapping", "url");
    script.setAttribute("data-strict", "1");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "pt");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    // Anexa o script configurado ao elemento de referência, o que fará o Giscus carregar
    giscusRef.current.appendChild(script);

  }, []); // O array vazio de dependências garante que este efeito seja executado apenas uma vez, quando o componente é montado.

  return <section ref={giscusRef} className="giscus-container mt-4" />;
};

export default GiscusComponent;