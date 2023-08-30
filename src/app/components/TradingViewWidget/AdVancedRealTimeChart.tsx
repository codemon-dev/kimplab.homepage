"use client"
import React, { useEffect, useRef, useState } from 'react';
import { AdvancedRealTimeChartProps } from 'react-ts-tradingview-widgets';
import { generateRandomString } from '@/app/lib/tradeHelper';
let tvScriptLoadingPromise: any;

export default function AdVancedRealTimeChart({option}: any) {
  const onLoadScriptRef = useRef<any>();
  const cointainerId = useRef<string>(`tradingview_${generateRandomString(8)}`)
  const advancedRealTimeChartPropsRef = useRef<AdvancedRealTimeChartProps>()

  useEffect(() => {
    advancedRealTimeChartPropsRef.current = option;
    onLoadScriptRef.current = createWidget();
    console.log(advancedRealTimeChartPropsRef.current)
    console.log(onLoadScriptRef.current)
    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement('script');
        script.id = 'tradingview-widget-loading-script';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.type = 'text/javascript';
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current);

    return () => {
        onLoadScriptRef.current = null;    
        return;
    }
  }, [option])

  const createWidget = () => {
    if (document.getElementById(cointainerId.current) && 'TradingView' in window) {
      return new window.TradingView.widget({
        autosize: advancedRealTimeChartPropsRef.current?.autosize,
        symbol: advancedRealTimeChartPropsRef.current?.symbol,
        interval: advancedRealTimeChartPropsRef.current?.interval,
        theme: advancedRealTimeChartPropsRef.current?.theme,
        style: advancedRealTimeChartPropsRef.current?.style,
        locale: advancedRealTimeChartPropsRef.current?.locale,
        withdateranges: advancedRealTimeChartPropsRef.current?.withdateranges,
        enable_publishing: false,
        allow_symbol_change: advancedRealTimeChartPropsRef.current?.allow_symbol_change,
        save_image: advancedRealTimeChartPropsRef.current?.save_image,    
        show_popup_button: advancedRealTimeChartPropsRef.current?.show_popup_button,
        container_id: cointainerId.current
      });
    }
  }

  return (
    <div className='tradingview-widget-container' style={{width: "100%", height: "100%"}}>
      <div id={cointainerId.current} style={{width: "100%", height: "100%"}}/>
      {/* <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a>
      </div> */}
    </div>
  );
}


