'use client'

import React, { useEffect, useRef, memo } from 'react';

export function MiniChart({exchange, coinPair}: any) {
    const isMountedRef = useRef(false)
    const container = useRef<any>();
    const colorTheme = useRef("light");  // dark / light

    useEffect(() => {
        if (isMountedRef.current === true) {
            return;
        }
        isMountedRef.current = true;
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `{
          "symbol": "${exchange}:${coinPair}",
          "width": "100%",
          "height": "100%",
          "locale": "en",
          "dateRange": "1M",
          "colorTheme": "light",
          "isTransparent": false,
          "autosize": true,
          "largeChartUrl": ""
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
        <div className="tradingview-widget-container" ref={container}>
          <div className="tradingview-widget-container__widget"></div>
        </div>
    );
}

export default memo(MiniChart);