"use client"

import WS from "ws"
import { getInitialInfoUpbit, startOrderBookWebsocket, startTickerWebsocket, startTradeWebsocket } from "@/app/lib/exchange/upbit/upbitCtrl";
import { getInitialInfoBinance, startWebSocket } from "../lib/exchange/binance/binanceCtrl";
import { EXCHANGE, MARKET, WS_TYPE } from "@/config/enum";
import { IAggTradeInfo, IExchangeCoinInfo, IOrderBook } from "@/config/interface";

function useExchange() {
    let socketMap: Map<string, any> = new Map<string, any>();

    let upbit_trade: Map<string, IAggTradeInfo> = new Map<string, IAggTradeInfo>();
    let upbit_orderbook: Map<string, IOrderBook> = new Map<string, IOrderBook>();
    let bithumb_trade: Map<string, IAggTradeInfo> = new Map<string, IAggTradeInfo>();
    let bithumb_orderbook: Map<string, IOrderBook> = new Map<string, IOrderBook>();
    let binance_trade: Map<string, IAggTradeInfo> = new Map<string, IAggTradeInfo>();
    let binance_orderbook: Map<string, IOrderBook> = new Map<string, IOrderBook>();
    let bybit_trade: Map<string, IAggTradeInfo> = new Map<string, IAggTradeInfo>();
    let bybit_orderbook: Map<string, IOrderBook> = new Map<string, IOrderBook>();

    const wsOptions = {
        WebSocket: WS,
        maxReconnectionDelay: 10000,
        minReconnectionDelay: 1000 + Math.random() * 4000,
        reconnectionDelayGrowFactor: 1.3,
        minUptime: 5000,
        connectionTimeout: 4000,
        maxRetries: Infinity,
        maxEnqueuedMessages: Infinity,
        startClosed: false,
        debug: false,
    };

    const getInitialInfo = () => {        
        return new Promise(async (resolve) => {
            let exchangeConinInfos: Map<EXCHANGE, Map<string, IExchangeCoinInfo>> = new Map<EXCHANGE, Map<string, IExchangeCoinInfo>>();
            let promises: any = []
            promises.push(getInitialInfoUpbit());        
            promises.push(getInitialInfoBinance());
            const promiseRet = await Promise.all(promises);
            promiseRet?.forEach((ret: any) => {
                if (ret && ret.length > 0) {
                    (ret as IExchangeCoinInfo[])?.forEach((obj: IExchangeCoinInfo) => {
                        if (exchangeConinInfos.has(obj.exchange)) {
                            exchangeConinInfos.get(obj.exchange)?.set(obj.coinPair, obj);
                        } else {
                            exchangeConinInfos.set(obj.exchange, new Map<string, IExchangeCoinInfo>());
                            exchangeConinInfos.get(obj.exchange)?.set(obj.coinPair, obj)
                        }
                    })
                }
            })
            resolve(exchangeConinInfos);
        })
    }

    const startWebsocket = (type: WS_TYPE, codes: string[], listener?: any) => {
        if (!codes || codes.length === 0) { 
            return null 
        }
        return new Promise(async (resolve) => {
            if (type === WS_TYPE.UPBIT_TICKER) {
                const ws = startTickerWebsocket(codes, (res: IAggTradeInfo[]) => { 
                    if (listener) { listener(res) }
                    // if (res) { upbit_trade.set(res.coinPair, res) }
                });
                resolve(ws);
            } else if (type === WS_TYPE.UPBIT_TRADE) {
                if (codes.length === 0) { resolve(null) }
                const ws = startTradeWebsocket(codes, (res: IAggTradeInfo) => { 
                    if (listener) { listener(res) }
                    if (res) { upbit_trade.set(res.coinPair, res) }
                });
                resolve(ws);
            } else if (type === WS_TYPE.UPBIT_ORDER_BOOK) {
                const ws = startOrderBookWebsocket(codes, (res: IOrderBook) => { 
                    if (listener) { listener(res) }
                    if (res) { upbit_orderbook.set(res.coinPair, res) }
                });
                resolve(ws);
            }
        })
    }

    return {
        getInitialInfo, 
        startWebsocket,
        socketMap,
        upbit_trade,
        upbit_orderbook,
        bithumb_trade,
        bithumb_orderbook,
        binance_trade,
        binance_orderbook,
        bybit_trade,
        bybit_orderbook,
    }
}

export default useExchange