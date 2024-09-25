import React, { useEffect, useRef } from 'react';
import { 
  ZERO_ID_WIDGET_API_KEY, 
  ZERO_ID_WIDGET_VERIFIER_URL, 
  ZERO_ID_WIDGET_ENV 
} from '../../config/constants/environments';

declare global {
  interface Window {
    ZeroIdSdk: any; // or provide a more specific type if known
  }
}

export default function ZeroIDWidget() {
  const widgetRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://${ZERO_ID_WIDGET_ENV}.swipelux.com/sdk.js`;
    script.async = true;
    script.onload = () => {
      const ZeroIdSdk = window.ZeroIdSdk;
      if (ZeroIdSdk) {
        ZeroIdSdk.init(widgetRef.current, {
          apiKey: ZERO_ID_WIDGET_API_KEY,
          verifierUrl: ZERO_ID_WIDGET_VERIFIER_URL,
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div ref={widgetRef}></div>;
};

