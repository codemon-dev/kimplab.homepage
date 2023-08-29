'use client'

import React, { useEffect, useRef, memo } from 'react';

export function TradingViewWidgetHeatMap() {
    const isMountedRef = useRef(false)
    const container = useRef<any>();

    useEffect(
        () => {
            if (isMountedRef.current === true) {
                return;
            }
            isMountedRef.current = true;
            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js";
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = `
                {
                    "dataSource": "Crypto",
                    "blockSize": "market_cap_calc",
                    "blockColor": "change",
                    "locale": "en",
                    "symbolUrl": "",
                    "colorTheme": "light",
                    "hasTopBar": false,
                    "isDataSetEnabled": false,
                    "isZoomEnabled": true,
                    "hasSymbolTooltip": true,
                    "width": "100%",
                    "height": "100%"
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

export default memo(TradingViewWidgetHeatMap);
