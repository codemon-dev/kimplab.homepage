"use client"

import _ from "lodash";
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { EXCHANGE, MARKET, MARKET_CURRENCY, WS_TYPE } from '@/config/enum';
import { Card, Tabs } from 'antd';
import TabContents, { IPrimiumTabContentsProps } from '@/app/home/PrimiumSummary/TabContents';
import { IAggTradeInfo } from '@/config/interface';
import './PrimiumSummaryStyle.css'
import { useGlobalStore } from '@/app/hook/useGlobalStore';
import useExchange from '@/app/hook/useExchange';
import { getEmptyAggTradeInfo } from "@/app/lib/tradeHelper";
import { CardTabListType } from "antd/es/card";

const supportSymbols = ["BTC", "ETH", "BCH", "ETC", "ADA", "XRP", "TRX", "DOGE", "SOL", "EOS"]

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
    const selectedTabKeyRef = useRef(supportSymbols[0]);
    const [tabTitleList, setTabTitleList] = useState<any>();
    const tabContentMapRef = useRef<Map<string, IPrimiumTabContentsProps>>(new Map())
    const [selectedTabContent, setSelectedTabContent] = useState<IPrimiumTabContentsProps>({defaultExchange: selectedDefaultExchange.current, symbol: selectedSymbol.current, aggTradeInfos: []})
    
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
        createTabTileList();
        let promises = []
        promises.push(initUpbitWebSocket());
        promises.push(initBithumbWebSocket());
        promises.push(initBinanceWebSocket());
        promises.push(initBybitbWebSocket());
        await Promise.all(promises);
        initWebsocketDone.current = true;
        upateTabItem();
    }

    const createTabTileList = () => {
        let titleList: CardTabListType[] = []
        supportSymbols.forEach((symbol: string) => {
            titleList.push({
                key: symbol, 
                label: symbol,
                tab: <p>ddd</p>
            })
        })
        setTabTitleList([...titleList]);
    }

    const upateTabItem = () => {
        supportSymbols.forEach((symbol: string) => {
            tabContentMapRef.current.set(symbol, createTabContentProps(symbol))
        })
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
            defaultExchange: selectedDefaultExchange.current,
            symbol,
            aggTradeInfos: aggTradeInfoList
        };
        if (symbol == selectedSymbol.current) setSelectedTabContent(_.cloneDeep(props))
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

    const onChange = (key: any) => {
        console.log("onChange. key: ", key)
        if (!key) return;
        selectedTabKeyRef.current = key
        selectedSymbol.current = key
        let preTabContent = tabContentMapRef.current.get(key)
        if (!preTabContent) return;
        console.log("preTabContent: ", preTabContent)
        setSelectedTabContent(_.cloneDeep(preTabContent))
    }

    return (
        <Card
            bordered={false}
            // style={{flex: 1, display: "flex", flexDirection: "column", width: "100%", height: "100%", margin: 0, padding: 0, overflow: 'auto'}}
            headStyle={{backgroundColor: "#001529", color: "whitesmoke"}}
            tabProps={{size: "small", type: "line", style:{backgroundColor: "transparent", color: "whitesmoke", flex: 1}}}
            tabList={tabTitleList}
            activeTabKey={selectedTabKeyRef.current}
            onTabChange={onChange}
        >
            <TabContents 
                symbol={selectedTabContent.symbol} 
                defaultExchange={selectedTabContent.defaultExchange} 
                aggTradeInfos={selectedTabContent.aggTradeInfos} />
        </Card>
    );
};

export default PrimiumSummary;




