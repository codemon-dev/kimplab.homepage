"use client"

import jwt from "jsonwebtoken";
import WS from "ws"
import { v4 as uuidv4 } from "uuid";
import crypto from 'crypto';
import { ASK_BID, EXCHANGE, FETCH_METHOD, MARKET } from "@/config/enum";
import querystring from "querystring";
import { IAggTradeInfo, IExchangeCoinInfo } from "@/config/interface";
import { UPBIT_ENDPOINT, UPBIT_PONG_RESPONSE, UpbitSocketPayload, UpbitSocketSimpleResponse } from "./IUpbit";
import { parseCoinInfoFromCoinPair } from "@/app/helper/cryptoHelper";
import ReconnectingWebSocket from "reconnecting-websocket";

const UPBI_WS_ADDR = "wss://api.upbit.com/websocket/v1"

export const getInitialInfoUpbit = async () => {
    const response: any = await fetchUpbitApi(FETCH_METHOD.GET, UPBIT_ENDPOINT.API_MARKET_ALL);
    // console.log("response: ", response)
    let upbitExchangeInfos: IExchangeCoinInfo[] = []
    if (!response) {
        return null;
    }
    if (response) {
            response.forEach((obj: any) => {
                const {symbol, coinPair, market} = parseCoinInfoFromCoinPair(EXCHANGE.UPBIT, obj.market)
                let info: IExchangeCoinInfo = {
                    exchange: EXCHANGE.UPBIT,
                    symbol: symbol,
                    coinPair: coinPair,
                    market: market as MARKET,
                    // network: "", // string[] parse해야 함.
                    name_kor: obj.korean_name,
                    name_eng: obj.english_name,
                    warning: obj.market_warning === "NONE"? false: true,
                    // trading: true,
                    // deposit: true,
                    // withdraw: true,
                    // numOfDepositConfirm: 0,
                    // numOfWithdrawConfirm: 0,
                    // limitTradingFee: 0,
                    // marketTradingFee: 0,
                    // depositFee: 0,
                    // withdrawFee: 0,
                }
                // console.log(`symbol: ${info.symbol}, coinPair: ${info.coinPair}, market: ${info.market}`)
                upbitExchangeInfos.push(info);
            });
        // console.log(upbitExchangeInfos)
        return upbitExchangeInfos;
    }
}

export const urlProvider = async () => {
    return UPBI_WS_ADDR;
};

export const isPongResponse = (object: any): object is UPBIT_PONG_RESPONSE => {
    return 'status' in object;
}

export const startTickerWebsocket = (coinPairs: string[], listener: any) => {
    const format = 'SIMPLE'
    let ws: ReconnectingWebSocket | undefined;
    let payload: UpbitSocketPayload = {
        type: 'ticker',
        codes: coinPairs,
        isOnlySnapshot: false,
        isOnlyRealtime: false,
    }
    
    const options = {
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
    
    const UUID = uuidv4()
    let ticket: string = ""
    ticket = UUID + (ticket? `-${ticket}`: "");    
    ws?.close();
    ws = new ReconnectingWebSocket(urlProvider, [], options);
    let snapshot: IAggTradeInfo[] = []
    ws.addEventListener('message',  (payload) => {
        try {
            payload.data.text().then((obj: any) => {
                const response: UpbitSocketSimpleResponse | UPBIT_PONG_RESPONSE = {...(JSON.parse(obj))};
                if (isPongResponse(response) === true) {
                    console.log("pong. ", response);
                } else {
                    const res: UpbitSocketSimpleResponse = {...response as UpbitSocketSimpleResponse};
                    const {symbol, coinPair, market} = parseCoinInfoFromCoinPair(EXCHANGE.UPBIT, res.cd)
                    let aggTradeInfo: IAggTradeInfo = {
                        exchange: EXCHANGE.UPBIT,
                        market: market as MARKET,
                        symbol: symbol,
                        coinPair: coinPair,
                        price: res.tp,
                        accVolume: res.atv,
                        accVolume_24h: res.atv24h,
                        accTradePrice: res.atp,
                        accTradePrice_24h: res.atp24h,
                        preClosingPrice: res.pcp,
                        askBid: res.ab === "ASK"? ASK_BID.ASK: ASK_BID.BID,    
                        change: res.scp,
                        changeRate: res.scr * 100,
                        timestamp: res.ttms
                    }
                    if (res.st === "SNAPSHOT") {
                        snapshot.push(aggTradeInfo)
                    } else {
                        if (snapshot.length > 0) {
                            listener(snapshot);
                            snapshot = [];
                        }
                        listener([aggTradeInfo]);
                    }
                }
            })
        }
        catch (err) {
            console.log("err:" , err)
        }
    })
    ws.onopen = (event) => {
        console.log("onopen", event)
        try {
            // console.log(`${JSON.stringify([{ ticket: ticket }, { ...payload }, { format }])}`)
            ws?.send(`${JSON.stringify([{ ticket: ticket }, { ...payload }, { format }])}`)
        } catch (err: any) {
            console.error("[UPBIT] tickerWS.onopen err: ", err)
        }
        
    };
    ws.onerror = (event) => {
        try {
            console.log("onerror", event)
        } catch (err: any) {
            console.error("[UPBIT] tickerWS.onerror err: ", err)
        }
        
    };
    ws.onclose = (event) => {
        try {
            console.log("onclose", event)
        } catch (err: any) {
            console.error("[UPBIT] tickerWS.onclose err: ", err)
        }
    };
    return ws;
}

export const startTradeWebsocket = (coinPairs: string[], listener: any) => {
    const format = 'SIMPLE'
    let tradeWS: ReconnectingWebSocket | undefined;
    let payload: UpbitSocketPayload = {
        type: 'trade',
        codes: coinPairs,
        isOnlySnapshot: false,
        isOnlyRealtime: false,
    }
    
    const options = {
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
    
    const UUID = uuidv4()
    let ticket: string = ""
    ticket = UUID + (ticket? `-${ticket}`: "");    
    tradeWS?.close();
    tradeWS = new ReconnectingWebSocket(urlProvider, [], options);
    tradeWS.addEventListener('message',  (payload) => {
        try {
            payload.data.text().then((obj: any) => {
                const response: UpbitSocketSimpleResponse | UPBIT_PONG_RESPONSE = {...(JSON.parse(obj))};
                if (isPongResponse(response) === true) {
                    console.log("pong. ", response);
                } else {
                }
            })
        }
        catch (err) {
            console.log("err:" , err)
        }
    })
    tradeWS.onopen = (event) => {
        console.log("onopen", event)
        try {
            // console.log(`${JSON.stringify([{ ticket: ticket }, { ...payload }, { format }])}`)
            tradeWS?.send(`${JSON.stringify([{ ticket: ticket }, { ...payload }, { format }])}`)
        } catch (err: any) {
            console.error("[UPBIT] tradeWS.onopen err: ", err)
        }
        
    };
    tradeWS.onerror = (event) => {
        try {
            console.log("onerror", event)
        } catch (err: any) {
            console.error("[UPBIT] tradeWS.onerror err: ", err)
        }
        
    };
    tradeWS.onclose = (event) => {
        try {
            console.log("onclose", event)
        } catch (err: any) {
            console.error("[UPBIT] tradeWS.onclose err: ", err)
        }
    };
    return tradeWS;
}

export const startOrderBookWebsocket = (coinPairs: string[], listener: any) => {
    const format = 'SIMPLE'
    let orderbookWs: ReconnectingWebSocket | undefined;
    let payload: UpbitSocketPayload = {
        type: 'orderbook',
        codes: coinPairs,
        isOnlySnapshot: false,
        isOnlyRealtime: false,
    }
    
    const options = {
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
    
    const UUID = uuidv4()
    let ticket: string = ""
    ticket = UUID + (ticket? `-${ticket}`: "");    
    orderbookWs?.close();
    orderbookWs = new ReconnectingWebSocket(urlProvider, [], options);
    orderbookWs.addEventListener('message',  (payload) => {
        try {
            payload.data.text().then((obj: any) => {
                const response: UpbitSocketSimpleResponse | UPBIT_PONG_RESPONSE = {...(JSON.parse(obj))};
                if (isPongResponse(response) === true) {
                    console.log("pong. ", response);
                } else {
                    const res: UpbitSocketSimpleResponse = {...response as UpbitSocketSimpleResponse};
                    listener(res)
                }
            })
        }
        catch (err) {
            console.log("err:" , err)
        }
    })
    orderbookWs.onopen = (event) => {
        console.log("onopen", event)
        try {
            // console.log(`${JSON.stringify([{ ticket: ticket }, { ...payload }, { format }])}`)
            orderbookWs?.send(`${JSON.stringify([{ ticket: ticket }, { ...payload }, { format }])}`)
        } catch (err: any) {
            console.error("[UPBIT] orderbookWs.onopen err: ", err)
        }
        
    };
    orderbookWs.onerror = (event) => {
        try {
            console.log("onerror", event)
        } catch (err: any) {
            console.error("[UPBIT] orderbookWs.onerror err: ", err)
        }
        
    };
    orderbookWs.onclose = (event) => {
        try {
            console.log("onclose", event)
        } catch (err: any) {
            console.error("[UPBIT] orderbookWs.onclose err: ", err)
        }
    };
    return orderbookWs;
}



export const fetchUpbitApi = (method: FETCH_METHOD, endpoint: string, body?: any, apiKey?: string, secretKey?: string) => {
    // console.log(("fetchUpbitApi. endpoint: ", endpoint);
    let query = body? querystring.encode(body): null
    const requestBody = body? JSON.stringify(body): undefined;
    let authorizationToken = body? getAuthorizationToken(query): getAuthorizationToken();
    if (query && !authorizationToken) {
        console.log("[UPBIT] fail to get getAuthorizationToken. skip to fetchUpbitApi")
        return null;
    }
    // this.handlers?.logHandler?.log?.debug("fetchUpbitApi options: ", options)

    return new Promise(async (resolve: any, reject: any) => {            
        try {
            const response = await fetch(
                query? `${endpoint}?${query}`: endpoint, {
                    method,
                    // headers,
                    headers: {
                        "Authorization": authorizationToken as string,
                        "X-Requested-With": "XMLHttpRequest",
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                        "cache-control": "max-age=0",
                        "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"115\", \"Chromium\";v=\"115\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "document",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "none",
                        "sec-fetch-user": "?1",
                        "upgrade-insecure-requests": "1"
                    },
                    body: requestBody,
            });
            if (response.status !== 200) {
                console.log("[UPBIT] fetchUpbitApi endpoint: ", endpoint);
                console.log("[UPBIT] fetchUpbitApi error: ", response);
                resolve(null) 
            }
            const jsonData = await response.json();
            // console.log("jsonData: ", jsonData)
            try {
                if (jsonData.error) {
                    console.log("[UPBIT] [error return] fetchUpbitApi endpoint: ", endpoint);
                    console.log("[UPBIT] [error return] fetchBalance error message: ", jsonData.error?.message)
                    console.log("[UPBIT] [error return] fetchBalance error name: ", jsonData.error?.name)
                    resolve(null);
                    return;
                }
            } catch (err) {
                // 오류 아님. 위에서 parsing하는건 error json 파싱위해 하는것임.
            }
            resolve(jsonData)
        } catch (err: any) {
            console.log("[UPBIT] fetchUpbitApi err: ", err);
            resolve(null);
        }
    })
}

const getAuthorizationToken = (query?: any, apiKey?: string, secretKey?: string) => {
    if (!apiKey || !secretKey) {
        // console.log("[UPBIT] apikey is empty. skip getTokern.")
        return null;
    }
    let payload = {
        access_key: apiKey,
        nonce: uuidv4(),
    };

    if (query) {
        const hash = crypto.createHash('sha512');
        const queryHash = hash.update(query, 'utf-8').digest('hex');
        payload = {...payload, ...{query_hash: queryHash, query_hash_alg: 'SHA512'}}
    }
    const jwtToken = jwt.sign(payload, secretKey);
    const authorizationToken = `Bearer ${jwtToken}`;
    return authorizationToken;
}