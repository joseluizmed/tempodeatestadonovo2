import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AdManager: React.FC = () => {
  const location = useLocation();

  // Effect for alternating In-Page Push ads
  useEffect(() => {
    const adZones = ['9916510', '9916505'];
    const storageKey = 'lastShownInPagePush';
    const scriptId = 'monetag-inpage-push-script';

    // Always remove the old script on navigation to ensure a fresh one is added.
    // This also helps if Chrome removes it; on next navigation, we try again.
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const lastShown = localStorage.getItem(storageKey);
    const zoneToShow = lastShown === adZones[0] ? adZones[1] : adZones[0];

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://jsc.monetag.com/${zoneToShow}/tag.min.js`;
    script.async = true;
    script.dataset.cfasync = 'false';
    document.body.appendChild(script);

    localStorage.setItem(storageKey, zoneToShow);

  }, [location.pathname]);

  return null; // This component renders nothing
};

export default AdManager;
