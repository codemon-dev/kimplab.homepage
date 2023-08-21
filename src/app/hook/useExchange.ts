"use client"

import { getInitialInfoUpbit, startOrderBookWebsocket, startTickerWebsocket, startTradeWebsocket } from "@/app/lib/exchange/upbit/upbitCtrl";
import { 
    binance_coin_m_future_startTickerWebsocket, 
    binance_usd_m_future_startTickerWebsocket, 
    binance_spot_startTickerWebsocket, 
    getInitialInfoBinanceSpot, 
    getInitialInfoBinanceUsdMFuture,
    getInitialInfoBinanceCoinMFuture,
    binance_usd_m_future_startOrderWebsocket,
    binance_coin_m_future_startOrderWebsocket,
    binance_usd_m_future_startMarketPriceWebsocket,
    binance_coin_m_future_startMarketPriceWebsocket
} from "../lib/exchange/binance/binanceCtrl";
import { EXCHANGE, MARKET, WS_TYPE } from "@/config/enum";
import { IAggTradeInfo, IExchangeCoinInfo, IFundingFeeInfo, IOrderBook } from "@/config/interface";

function useExchange() {
    let socketMap: Map<string, any> = new Map<string, any>();
    const getInitialInfo = () => {        
        return new Promise(async (resolve) => {
            let exchangeConinInfos: Map<EXCHANGE, Map<string, IExchangeCoinInfo>> = new Map<EXCHANGE, Map<string, IExchangeCoinInfo>>();
            let promises: any = []
            promises.push(getInitialInfoUpbit());        
            promises.push(getInitialInfoBinanceSpot());
            promises.push(getInitialInfoBinanceUsdMFuture());
            promises.push(getInitialInfoBinanceCoinMFuture());
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
            // console.log("exchangeConinInfos: ", exchangeConinInfos)
            resolve(exchangeConinInfos);
        })
    }

    const startWebsocket = (type: WS_TYPE, codes: string[], listener?: any) => {        
        const wsOptions = {
            WebSocket: WebSocket,
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
        return new Promise(async (resolve) => {
            if (type === WS_TYPE.UPBIT_TICKER) {
                const ws = startTickerWebsocket(codes, wsOptions, (res: IAggTradeInfo[]) => { 
                    if (listener) { listener(res) }
                    // if (res) { upbit_trade.set(res.coinPair, res) }
                });
                resolve(ws);
            } else if (type === WS_TYPE.UPBIT_TRADE) {
                if (codes.length === 0) { resolve(null) }
                const ws = startTradeWebsocket(codes, wsOptions, (res: IAggTradeInfo) => { 
                    if (listener) { listener(res) }
                });
                resolve(ws);
            } else if (type === WS_TYPE.UPBIT_ORDER_BOOK) {
                const ws = startOrderBookWebsocket(codes, wsOptions, (res: IOrderBook) => { 
                    if (listener) { listener(res) }
                });
                resolve(ws);
            } else if (type === WS_TYPE.BINANCE_SPOT_TICKER) {
                const ws = binance_spot_startTickerWebsocket(codes, wsOptions, (res: IAggTradeInfo[]) => { 
                    if (listener) { listener(res) }
                });
                resolve(ws);
            } else if (type === WS_TYPE.BINANCE_USD_M_FUTURE_TICKER) {
                const ws = binance_usd_m_future_startTickerWebsocket(codes, wsOptions, (res: IAggTradeInfo[]) => { 
                    if (listener) { listener(res) }
                });
                resolve(ws);
            } else if (type === WS_TYPE.BINANCE_COIN_M_FUTURE_TICKER) {
                const ws = binance_coin_m_future_startTickerWebsocket(codes, wsOptions, (res: IAggTradeInfo[]) => { 
                    if (listener) { listener(res) }
                });
                resolve(ws);
            } else if (type === WS_TYPE.BINANCE_USD_M_FUTURE_ORDER_BOOK) {
                const ws = binance_usd_m_future_startOrderWebsocket(codes, wsOptions, (res: IAggTradeInfo[]) => { 
                    if (listener) { listener(res) }
                });
                resolve(ws);
            } else if (type === WS_TYPE.BINANCE_COIN_M_FUTURE_ORDER_BOOK) {
                const ws = binance_coin_m_future_startOrderWebsocket(codes, wsOptions, (res: IAggTradeInfo[]) => { 
                    if (listener) { listener(res) }
                });
                resolve(ws);
            } else if (type === WS_TYPE.BINANCE_USD_M_FUTURE_MARKET_PRICE) {
                const ws = binance_usd_m_future_startMarketPriceWebsocket(codes, wsOptions, (res: IFundingFeeInfo[]) => { 
                    if (listener) { listener(res) }
                });
                resolve(ws);
            } else if (type === WS_TYPE.BINANCE_COIN_M_FUTURE_MARKET_PRICE) {
                const ws = binance_coin_m_future_startMarketPriceWebsocket(codes, wsOptions, (res: IFundingFeeInfo[]) => { 
                    if (listener) { listener(res) }
                });
                resolve(ws);
            }
        })
    }

    return {
        getInitialInfo, 
        startWebsocket,
        socketMap,
    }
}

export default useExchange