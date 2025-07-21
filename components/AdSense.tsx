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
    // We only want to load the ad if the 'adSlot' is a real value.
    if (adSlot && !adSlot.startsWith('YOUR_AD_SLOT_ID_HERE')) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense Error:', err);
      }
    }
  }, [adSlot]); // Rerun the effect if the adSlot changes

  // Display a placeholder if the 'adSlot' is not configured.
  // This helps the developer (user) understand what to do next.
  if (!adSlot || adSlot.startsWith('YOUR_AD_SLOT_ID_HERE')) {
    return (
      <div className="w-full min-h-[250px] bg-yellow-100 border-2 border-dashed border-yellow-400 flex flex-col items-center justify-center text-yellow-800 rounded-lg p-4 text-center">
        <span className="font-bold text-lg mb-2">Anúncio do Google AdSense</span>
        <p className="text-sm">Para exibir um anúncio aqui, substitua o valor de <strong>adSlot</strong> por sua ID de Bloco de Anúncios real.</p>
        <p className="text-xs mt-2">Você pode obter esta ID em sua conta do AdSense. O slot atual é: <strong>"{adSlot}"</strong>.</p>
      </div>
    );
  }

  // Render the real ad unit if the 'adSlot' is configured.
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
