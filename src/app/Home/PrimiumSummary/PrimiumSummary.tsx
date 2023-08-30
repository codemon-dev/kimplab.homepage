"use client"

import _ from "lodash";
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { EXCHANGE, MARKET, WS_TYPE } from '@/config/enum';
import { Tabs } from 'antd';
import TabContents, { IPrimiumTabContentsProps } from './TabContents';
import { IAggTradeInfo } from '@/config/interface';
import './PrimiumSummaryStyle.css'
import { useGlobalStore } from '@/app/hook/useGlobalStore';
import useExchange from '@/app/hook/useExchange';
import { getEmptyAggTradeInfo } from "@/app/lib/tradeHelper";

const supportSymbols = ["BTC", "ETH", "BCH", "ETC", "ADA", "XRP", "TRX", "DOGE", "SOL"]

interface TabItemType {
    label: string,
    key: string,
    children: any,
}

export const PrimiumSummary = () => {
    const {state} = useGlobalStore();
    const {startWebsocket} = useExchange()
    const isMountedRef = useRef(false)
    const selectedDefaultExchange = useRef(EXCHANGE.BINANCE)
    const selectedSymbol = useRef("BTC")
    const initWebsocketDone = useRef(false)
    const wsRef = useRef<Map<WS_TYPE, any>>(new Map<WS_TYPE, any>())
    const upbit_aggTradeInfoMap = useRef<Map<string, IAggTradeInfo>>(new Map<string, IAggTradeInfo>())    
    const bithumb_aggTradeInfoMap = useRef<Map<string, IAggTradeInfo>>(new Map<string, IAggTradeInfo>())    
    const binance_aggTradeInfoMap = useRef<Map<string, IAggTradeInfo>>(new Map<string, IAggTradeInfo>())    
    const bybit_aggTradeInfoMap = useRef<Map<string, IAggTradeInfo>>(new Map<string, IAggTradeInfo>())    
    const [tabItems, setTabItems] = useState<TabItemType[]>([])

    
    useEffect(() => {
        if (isMountedRef.current === true) return;
        isMountedRef.current = true;
        initWebsocketDone.current = false;
        initialize();

        return () => {
            try {
                // eslint-disable-next-line react-hooks/exhaustive-deps 
                wsRef.current.forEach((ws: any, key: WS_TYPE) => {
                  console.log("close websocket. key: ", key);
                  ws?.close()
                })
              } catch {}
            isMountedRef.current = false;
            initWebsocketDone.current = false;
            return;
        }
    }, [])

    const initialize = async () => {
        let promises = []
        promises.push(initUpbitWebSocket());
        promises.push(initBithumbWebSocket());
        promises.push(initBinanceWebSocket());
        promises.push(initBybitbWebSocket());
        await Promise.all(promises);
        initWebsocketDone.current = true;
        upateTabItem();
    }

    const upateTabItem = () => {
        let items: TabItemType[] = []
        items = supportSymbols.map((symbol: string) => {
            let tabData = createTabContentProps(symbol)
            let item: TabItemType = {
                label: symbol,
                key: symbol,
                children: <TabContents symbol={tabData.symbol} exchange={tabData.exchange} aggTradeInfos={tabData.aggTradeInfos} />,
            }
            return item;
        })
        setTabItems([...items])
    }

    const createTabContentProps = useCallback((symbol: string) => {
        let aggTradeInfoList = []
        let aggTradeInfo = upbit_aggTradeInfoMap.current.get(symbol)
        if (!aggTradeInfo) aggTradeInfo = getEmptyAggTradeInfo(EXCHANGE.UPBIT)
        aggTradeInfoList.push(aggTradeInfo);
        aggTradeInfo = bithumb_aggTradeInfoMap.current.get(symbol)
        if (!aggTradeInfo) aggTradeInfo = getEmptyAggTradeInfo(EXCHANGE.BITHUMB)
        aggTradeInfoList.push(aggTradeInfo);
        aggTradeInfo = binance_aggTradeInfoMap.current.get(symbol)
        if (!aggTradeInfo) aggTradeInfo = getEmptyAggTradeInfo(EXCHANGE.BINANCE)
        aggTradeInfoList.push(aggTradeInfo);
        aggTradeInfo = bybit_aggTradeInfoMap.current.get(symbol)
        if (!aggTradeInfo) aggTradeInfo = getEmptyAggTradeInfo(EXCHANGE.BYBIT)
        aggTradeInfoList.push(aggTradeInfo);
        
        let props: IPrimiumTabContentsProps = {
            exchange: selectedDefaultExchange.current,
            symbol,
            aggTradeInfos: aggTradeInfoList
        };
        return props;
        
    }, [])

    const initUpbitWebSocket = useCallback(async () => {
        console.log("initUpbitWebSocket");
        return new Promise( async (resolve) => {
            const ws = wsRef.current.get(WS_TYPE.UPBIT_TICKER);
            ws?.close();
            wsRef.current.delete(WS_TYPE.UPBIT_TICKER)
            const codes: string[] = Array.from(state.exchangeConinInfos.get(EXCHANGE.UPBIT)?.keys() ?? []);
            const tickerWs = await startWebsocket(WS_TYPE.UPBIT_TICKER, codes, (aggTradeInfos: IAggTradeInfo[]) => {
                aggTradeInfos.forEach((aggTradeInfo: IAggTradeInfo) => {
                    if (aggTradeInfo.marketInfo.market !== MARKET.SPOT_KRW) return;
                    if (supportSymbols.includes(aggTradeInfo.symbol.toUpperCase()) === false) return;
                    upbit_aggTradeInfoMap.current.set(aggTradeInfo.symbol, aggTradeInfo);
                })                
                if (aggTradeInfos?.length > 1) resolve(true)
                if (initWebsocketDone.current === true) upateTabItem();
            })
            wsRef.current.set(WS_TYPE.UPBIT_TICKER, tickerWs);            
        })
    },[])

    const initBinanceWebSocket = useCallback(async () => {
        console.log("initBinanceWebSocket");
        return new Promise( async (resolve) => {
            const ws = wsRef.current.get(WS_TYPE.BINANCE_SPOT_TICKER);
            ws?.close();
            wsRef.current.delete(WS_TYPE.BINANCE_SPOT_TICKER)
            let codes: string[] = Array.from(state.exchangeConinInfos.get(EXCHANGE.BINANCE)?.keys() ?? []);
            const spotTickerWs = await startWebsocket(WS_TYPE.BINANCE_SPOT_TICKER, codes, (aggTradeInfos: IAggTradeInfo[]) => {
                // console.log("aggTradeInfos: ", aggTradeInfos)            
                aggTradeInfos.forEach((aggTradeInfo: IAggTradeInfo) => {
                    if (aggTradeInfo.marketInfo.market !== MARKET.SPOT_USDT) return;
                    if (supportSymbols.includes(aggTradeInfo.symbol.toUpperCase()) === false) return;
                    binance_aggTradeInfoMap.current.set(aggTradeInfo.symbol, aggTradeInfo);
                })
                if (aggTradeInfos?.length > 1) resolve(true);
                if (initWebsocketDone.current === true) upateTabItem();
            })
            wsRef.current.set(WS_TYPE.BINANCE_SPOT_TICKER, spotTickerWs);
        })
    },[])

    const initBithumbWebSocket = useCallback(async () => {
        console.log("initBithumbWebSocket");
        return new Promise( async (resolve) => {
            resolve(true)
        })
    },[])

    const initBybitbWebSocket = useCallback(async () => {
        console.log("initBybitbWebSocket");
        return new Promise( async (resolve) => {
            resolve(true)
        })
    },[])

    const onChange = (evt: any) => {
        console.log("onChange. evt: ", evt)
    }

    return (
        <Tabs
            tabBarGutter={0}
            tabBarStyle={{margin: 0}}
            onChange={onChange}
            type="card"
            items={tabItems}
        />
    );
};

export default PrimiumSummary;




