'use client'

import React, { useEffect, useRef, memo, useState } from 'react';

export function MiniChart({exchange, coinPair}: any) {
    const isMountedRef = useRef(false)
    const container = useRef<any>();
    const colorTheme = useRef("light");  // dark / light
    const [symbol, setSymbol] = useState(`${exchange}:${coinPair}`)
    const scriptRef = useRef<any>();

    useEffect(() => {
      setSymbol(`${exchange}:${coinPair}`)
      if (!scriptRef.current) return;
      updateScript();
    }, [exchange, coinPair])

    useEffect(() => {
        if (isMountedRef.current === true) {
            return;
        }
        isMountedRef.current = true;
        setSymbol(`${exchange}:${coinPair}`)
        createScript();
        if (container.current) {
            container.current.appendChild(scriptRef.current);
        }
        return () => {
            isMountedRef.current = false;
            return;
        }
      }, [] );

      const createScript = () => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `{
          "symbol": "${symbol}",
          "width": "100%",
          "height": "100%",
          "locale": "en",
          "dateRange": "1M",
          "colorTheme": "light",
          "isTransparent": false,
          "autosize": true,
          "largeChartUrl": ""
        }`;
        scriptRef.current = script;
      }

      const updateScript = () => {
        container.current.appendChild(scriptRef.current);
      }

    return (
        <div className="tradingview-widget-container" ref={container}>
          <div className="tradingview-widget-container__widget"></div>
        </div>
    );
}

export default memo(MiniChart);