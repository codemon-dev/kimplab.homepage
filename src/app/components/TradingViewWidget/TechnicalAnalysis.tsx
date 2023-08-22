'use client'

import React, { useEffect, useRef, memo } from 'react';

export function TechnicalAnalysis({exchange, coinPair, width, height}: any) {
    const isMountedRef = useRef(false)
    const container = useRef<any>();
    const colorTheme = useRef("light");  // dark / light

    useEffect(() => {
        if (isMountedRef.current === true) {
            return;
        }
        isMountedRef.current = true;
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `{
          "interval": "1M",
          "width": "100%",
          "height": "100%",
          "symbol": "${exchange}:${coinPair}",
          "showIntervalTabs": true,
          "locale": "en",
          "colorTheme": "light"
        }`;
        if (container.current) {
            container.current.appendChild(script);
        }
        return () => {
            isMountedRef.current = false;
            return;
        }
      }, [] );

    return (
        <div className="tradingview-widget-container" ref={container} style={{flex: 1}}>
          <div className="tradingview-widget-container__widget"></div>
        </div>
    );
}

export default memo(TechnicalAnalysis);
