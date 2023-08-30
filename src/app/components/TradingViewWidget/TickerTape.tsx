'use client'

import React, { useEffect, useRef, memo } from 'react';

export function TickerTape() {
    const isMountedRef = useRef(false)
    const container = useRef<any>();
    const colorTheme = useRef("light");  // dark / light

    useEffect(() => {
        if (isMountedRef.current === true) {
            return;
        }
        isMountedRef.current = true;
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `{
          "symbols": [                
            {
              "proName": "FOREXCOM:SPXUSD",
              "title": "S&P 500"
            },
            {
              "proName": "FOREXCOM:NSXUSD",
              "title": "US 100"
            },
            {
              "description": "환율",
              "proName": "FX_IDC:USDKRW"
            },
            {
              "description": "Bitcoin",
              "proName": "BINANCE:BTCUSDT"
            },
            {
              "description": "Etherium",
              "proName": "BINANCE:ETHUSDT"
            },
            {
              "description": "Ripple",
              "proName": "BINANCE:XRPUSDT"
            },
            {
              "description": "Doge",
              "proName": "BINANCE:DOGEUSDT"
            }
          ],
          "showSymbolLogo": true,
          "colorTheme": "${colorTheme.current}",
          "isTransparent": false,
          "displayMode": "adaptive",
          "locale": "kr"
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

export default memo(TickerTape);

