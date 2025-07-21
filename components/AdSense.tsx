import React, { useEffect } from 'react';

// Isso permite o acesso a window.adsbygoogle sem erros de TypeScript.
declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

interface AdSenseProps {
  adClient: string;
  adSlot: string;
  style?: React.CSSProperties;
  className?: string;
}

const AdSense: React.FC<AdSenseProps> = ({ adClient, adSlot, style, className }) => {
  useEffect(() => {
    // Nós só queremos carregar o anúncio se o 'adSlot' for real.
    if (adSlot && adSlot !== 'YOUR_AD_SLOT_ID_HERE') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('Erro no AdSense:', err);
      }
    }
  }, [adSlot]); // Executa o efeito novamente se o adSlot mudar

  // Exibe uma mensagem de placeholder se o 'adSlot' não estiver configurado.
  // Isso ajuda o desenvolvedor (usuário) a entender o que fazer a seguir.
  if (!adSlot || adSlot === 'YOUR_AD_SLOT_ID_HERE') {
    return (
      <div className="w-full min-h-[250px] bg-yellow-100 border-2 border-dashed border-yellow-400 flex flex-col items-center justify-center text-yellow-800 rounded-lg p-4 text-center">
        <span className="font-bold text-lg mb-2">Anúncio do Google AdSense</span>
        <p className="text-sm">Para exibir anúncios, substitua o valor de <strong>"YOUR_AD_SLOT_ID_HERE"</strong> pela sua ID de Bloco de Anúncios no arquivo <code>App.tsx</code>.</p>
        <p className="text-xs mt-2">Você pode obter esta ID em sua conta do AdSense.</p>
      </div>
    );
  }

  // Renderiza o bloco de anúncios real se o 'adSlot' estiver configurado.
  return (
    <div className={className} style={{ ...style, overflow: 'hidden', minHeight: '250px' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        aria-hidden="true"
      ></ins>
    </div>
  );
};

export default AdSense;
