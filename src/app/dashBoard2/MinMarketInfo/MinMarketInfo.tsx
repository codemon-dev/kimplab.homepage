"use client"

import _ from "lodash";
import React, {useEffect, useState, useRef, useCallback} from 'react';
import { Card } from "antd";
import { useGlobalStore } from '../../hook/useGlobalStore';
import { CURRENCY_SITE_TYPE, EXCHANGE, MARKET, WS_TYPE } from '@/config/enum';
import { removeTrailingZeros } from '../../helper/cryptoHelper';
import { Typography } from 'antd';
import { convertLocalTime } from '../../lib/timestampHelper';
import { IAggTradeInfo, ICurrencyInfo } from '@/config/interface';
import useExchange from '@/app/hook/useExchange';
import { calculatePrimium } from '@/app/lib/tradeHelper';
const { Title, Text } = Typography;

export default function MinMarketInfo() {
    const { state } = useGlobalStore();
    const {startWebsocket} = useExchange()
    const isMountRef = useRef(false);
    const currencyInfoRef = useRef<ICurrencyInfo>();
    const [currencyPrice, setCurrencyPrice] = useState<string>("")
    const [currencyDate, setCurrencyDate] = useState<string>("")
    const [dominance, setDominance] = useState<string>("")
    const [dominanceDate, setDominanceDate] = useState<string>("")
    const [primium, setPrimium] = useState<string>("")
    const [primiumDate, setPrimiumDate] = useState<string>("")

    const initWebsocketDone = useRef(false)
    const wsRef = useRef<Map<WS_TYPE, any>>(new Map<WS_TYPE, any>())
    const upbit_aggTradeInfoMap = useRef<Map<string, IAggTradeInfo>>(new Map<string, IAggTradeInfo>())    
    const binance_aggTradeInfoMap = useRef<Map<string, IAggTradeInfo>>(new Map<string, IAggTradeInfo>())    

    useEffect(() => {
        if (isMountRef.current === true) return;
        isMountRef.current = true;
        initWebsocketDone.current = false;
        initialize();
        updateCurrencyInfos();
        updateDominanceInfo();
        return () => {
            isMountRef.current = false;
            initWebsocketDone.current = false;
            try {
                // eslint-disable-next-line react-hooks/exhaustive-deps 
                wsRef.current.forEach((ws: any, key: WS_TYPE) => {
                  console.log("close websocket. key: ", key);
                  ws?.close()
                })
            } catch {}
        }
    }, [])

    useEffect(() => {
        updateCurrencyInfos();
    }, [state.currencyInfos])

    useEffect(() => {
        updateDominanceInfo();
    }, [state.dominanceInfo])

    const initialize = async () => {
        let promises = []
        promises.push(initUpbitWebSocket());
        promises.push(initBinanceWebSocket());
        await Promise.all(promises);
        initWebsocketDone.current = true;
    }

    const initUpbitWebSocket = async () => {
        console.log("initUpbitWebSocket");
        return new Promise( async (resolve) => {
            const ws = wsRef.current.get(WS_TYPE.UPBIT_TICKER);
            ws?.close();
            wsRef.current.delete(WS_TYPE.UPBIT_TICKER)
            const tickerWs = await startWebsocket(WS_TYPE.UPBIT_TICKER, ["KRW-BTC", "KRW-ETH"], (aggTradeInfos: IAggTradeInfo[]) => {
                aggTradeInfos.forEach((aggTradeInfo: IAggTradeInfo) => {
                    upbit_aggTradeInfoMap.current.set(aggTradeInfo.symbol, aggTradeInfo);
                })                
                if (aggTradeInfos?.length > 1) resolve(true)
                updatePrimium();
            })
            wsRef.current.set(WS_TYPE.UPBIT_TICKER, tickerWs);            
        })
    }

    const initBinanceWebSocket = async () => {
        console.log("initBinanceWebSocket");
        return new Promise( async (resolve) => {
            const ws = wsRef.current.get(WS_TYPE.BINANCE_SPOT_TICKER);
            ws?.close();
            wsRef.current.delete(WS_TYPE.BINANCE_SPOT_TICKER)
            let codes: string[] = Array.from(state.exchangeConinInfos.get(EXCHANGE.BINANCE)?.keys() ?? []);
            const spotTickerWs = await startWebsocket(WS_TYPE.BINANCE_SPOT_TICKER, ["BTCUSDT", "ETHUSDT"], (aggTradeInfos: IAggTradeInfo[]) => {
                // console.log("aggTradeInfos: ", aggTradeInfos)            
                aggTradeInfos.forEach((aggTradeInfo: IAggTradeInfo) => {
                    if (aggTradeInfo.marketInfo.market !== MARKET.SPOT_USDT) return;
                    binance_aggTradeInfoMap.current.set(aggTradeInfo.symbol, aggTradeInfo);
                })
                if (aggTradeInfos?.length > 1) resolve(true);
                updatePrimium();
            })
            wsRef.current.set(WS_TYPE.BINANCE_SPOT_TICKER, spotTickerWs);
        })
    }

    const updatePrimium = () => {
        if (initWebsocketDone.current === false) return;
        if (!currencyInfoRef.current?.price) return;
        let price_1 = upbit_aggTradeInfoMap.current.get("BTC")?.price ?? 0
        let price_2 = binance_aggTradeInfoMap.current.get("BTC")?.price ?? 0        
        const primium = calculatePrimium(price_1, price_2, currencyInfoRef.current?.price)
        setPrimium(primium.toFixed(2))
        setPrimiumDate(convertLocalTime(Date.now()))
    }

    const updateCurrencyInfos = () => {
        // console.log(state.currencyInfos)
        const currencyInfo: any = state.currencyInfos.get(CURRENCY_SITE_TYPE.WEBULL)
        if (!currencyInfo) return;
        currencyInfoRef.current = _.cloneDeep(currencyInfo);
        setCurrencyPrice(parseFloat(currencyInfo.price.toFixed(2)).toLocaleString())
        setCurrencyDate(convertLocalTime(currencyInfo.timestamp))
    }

    const updateDominanceInfo = () => {
        // console.log(state.dominanceInfo)
        if (!state.dominanceInfo || state.dominanceInfo.curDominance === 0 || state.dominanceInfo.chart?.length === 0) return;
        setDominance(removeTrailingZeros((state.dominanceInfo.curDominance * 100), 2))
        setDominanceDate(convertLocalTime(state.dominanceInfo.timestamp * 1000))
    }    
    
    return (
        <>
            <Card bordered={false} size="small" style={{width: "180px", height: "80px"}} bodyStyle={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%"}}>
                <Text style={{fontSize: "8px",color: "gray", margin: 0, padding: 0}}>BTC 도미넌스</Text>
                <Title level={3} style={{color: "#73a745", margin: 0, padding: 0}}>{dominance}%</Title>
                <Text style={{fontSize: "8px", color: "gray", margin: 0, padding: 0}}>{dominanceDate}</Text>
            </Card>                
            <Card bordered={false} size="small" style={{width: "180px", height: "80px"}} bodyStyle={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%"}}>
                <Text style={{fontSize: "8px", color: "gray", margin: 0, padding: 0}}>BTC 김치 프리미엄</Text>
                <Title level={3} style={{color: "#73a745", margin: 0, padding: 0}}>{primium}%</Title>
                <Text style={{fontSize: "8px", color: "gray", margin: 0, padding: 0}}>{primiumDate}</Text>
            </Card>                            
            <Card bordered={false} size="small" style={{width: "180px", height: "80px"}} bodyStyle={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%"}}>
                <Text style={{fontSize: "8px", color: "gray", margin: 0, padding: 0}}>환율 (WEEBULL)</Text>
                <Title level={3} style={{color: "#73a745", margin: 0, padding: 0}}>₩ {currencyPrice}</Title>
                <Text style={{fontSize: "8px", color: "gray", margin: 0, padding: 0}}>{currencyDate}</Text>
            </Card>                                
            
        </>
    );
}
