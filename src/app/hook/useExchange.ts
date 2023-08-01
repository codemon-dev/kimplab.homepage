"use client"

import WS from "ws"
import { getInitialInfoUPBIT, startOrderBookWebsocket, startTradeWebsocket } from "@/app/lib/exchange/upbit/upbitCtrl";
import { getInitialInfoBinance, startWebSocket } from "../lib/exchange/binance/binanceCtrl";
import { EXCHANGE, MARKET, WS_TYPE } from "@/config/enum";
import { IExchangeCoinInfo } from "@/config/interface";

const UPBI_WS_ADDR = "wss://api.upbit.com/websocket/v1"

interface UPBIT_PONG_RESPONSE {
    status: string;
}

function useExchange() {
    let socketMap: Map<string, any> = new Map<string, any>();
    let exchangeConinInfos: Map<EXCHANGE, IExchangeCoinInfo[]> = new Map<EXCHANGE, IExchangeCoinInfo[]>();
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
            let promises: any = []
            promises.push(getInitialInfoUPBIT());        
            promises.push(getInitialInfoBinance());
            const ret = await Promise.all(promises);
            if (ret[0]) {
                exchangeConinInfos.set(EXCHANGE.UPBIT, ret[0])
            }
            if (ret[1]) {
                exchangeConinInfos.set(EXCHANGE.BINANCE, ret[1])
            }
            resolve(exchangeConinInfos);
        })
    }

    const startWebsocket = (type: WS_TYPE, listener: any, codes?: string[], ) => {
        return new Promise(async (resolve) => {
            if (type === WS_TYPE.UPBIT_TRADE) {
                if (!codes || codes.length === 0) {
                    let allCodes: string[] = []
                    exchangeConinInfos.get(EXCHANGE.UPBIT)?.forEach((obj: IExchangeCoinInfo) => {
                        allCodes.push(obj.coinPair) 
                    });
                    codes = allCodes;
                    console.log("allCodes", exchangeConinInfos)
                }
                // console.log("codes: ", codes)
                if (codes.length === 0) {
                    resolve(null);
                }
                const ws = startTradeWebsocket(codes, (res: any) => {
                    // console.log(res)
                    listener(res);
                    
                });
                resolve(ws);
            } else if (type === WS_TYPE.UPBIT_ORDER_BOOK) {
                if (!codes || codes.length === 0) {
                    let allCodes: string[] = []
                    exchangeConinInfos.get(EXCHANGE.UPBIT)?.forEach((obj: IExchangeCoinInfo) => {
                        allCodes.push(obj.coinPair) 
                    });
                    codes = allCodes;
                }
                if (codes.length === 0) {
                    resolve(null);
                }
                const ws = startOrderBookWebsocket(codes, (res: any) => {
                    // console.log(res)
                    listener(res);
                });
                resolve(ws);
            }
        })
    }

    return {
        getInitialInfo, 
        startWebsocket
    }
}

export default useExchange