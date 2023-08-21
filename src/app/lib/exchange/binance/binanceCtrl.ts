"use client"

import { v4 as uuidv4 } from "uuid";
import { ASK_BID, EXCHANGE, FETCH_METHOD, MARKET, MARKET_CURRENCY, MARKET_TYPE } from "@/config/enum";
import { BINANCE_ENDPOINT, BinanceSocketPayload, IBinanceAggTrade, IBinanceBookTickerResponse, IBinanceTickerResponse, IBinanceWSTickerResponse } from "./IBinance";
import ReconnectingWebSocket from "reconnecting-websocket";
import { IAggTradeInfo, IExchangeCoinInfo, PriceQty } from "@/config/interface";
import { parseCoinInfoFromCoinPair } from "@/app/helper/cryptoHelper";
import _ from "lodash";

const BINANCE_SPOT_API_ADDR = "https://api.binance.com"
const BINANCE_SPOT_MARKET_WS_ADDR = "wss://stream.binance.com:9443/ws"
const BINANCE_USD_M_FUTURE_MARKET_WS_ADDR = "wss://fstream.binance.com/ws"
const BINANCE_COIN_M_FUTURE_MARKET_WS_ADDR = "wss://dstream.binance.com/ws"

const header = {
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
}


export const getInitialInfoBinanceSpot = async () => {
    const response = await fetch(BINANCE_ENDPOINT.API_SPOT_EXCHANGEINFO, {method: FETCH_METHOD.GET, headers: header, body: null})
    if (!response) return null;
    if (response.status !== 200) {
        console.log("[BINANCE] getInitialInfoBinanceSpot error: ", response);
        return null;
    }
    const jsonData = await response.json();
    return jsonData;

    let exchangeInfos: IExchangeCoinInfo[] = []
    if (jsonData) {
        jsonData.forEach((obj: any) => {
            const {symbol, coinPair, market} = parseCoinInfoFromCoinPair(EXCHANGE.BINANCE, MARKET_TYPE.SPOT, obj.market)
            let info: IExchangeCoinInfo = {
                exchange: EXCHANGE.BINANCE,
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
            exchangeInfos.push(info);
        });
    }
    // console.log(exchangeInfos)
    return exchangeInfos;
}

export const getInitialInfoBinanceUsdMFuture = async () => {
    const response = await fetch(BINANCE_ENDPOINT.API_USD_M_FUTURE_EXCHANGEINFO, {method: FETCH_METHOD.GET, headers: header, body: null})
    if (!response) return null;
    if (response.status !== 200) {
        console.log("[BINANCE] getInitialInfoBinanceUsdMFuture error: ", response);
        return null;
    }
    const jsonData = await response.json();
    return jsonData;
}

export const getInitialInfoBinanceCoinMFuture = async () => {
    const response = await fetch(BINANCE_ENDPOINT.API_COIN_M_FUTURE_EXCHANGEINFO, {method: FETCH_METHOD.GET, headers: header, body: null})
    if (!response) return null;
    if (response.status !== 200) {
        console.log("[BINANCE] getInitialInfoBinanceCoinMFuture error: ", response);
        return null;
    }
    const jsonData = await response.json();
    return jsonData;
}

const spotMarketStreamUrlProvider = async () => {
    return BINANCE_SPOT_MARKET_WS_ADDR;
};

const usdMfutureMarketStreamUrlProvider = async () => {
    return BINANCE_USD_M_FUTURE_MARKET_WS_ADDR;
};

const coinMfutureMarketStreamUrlProvider = async () => {
    return BINANCE_COIN_M_FUTURE_MARKET_WS_ADDR;
};

// const isPongResponse = (object: any): object is UPBIT_PONG_RESPONSE => {
//     return 'status' in object;
// }


export const binance_spot_startTickerWebsocket = async (codes: string[], options: any, listener: any) => {
    // const response = await fetch(BINANCE_ENDPOINT.API_SPOT_TICKER + `/24hr?symbols=${JSON.stringify(codes)}`, {
    const response = await fetch(BINANCE_ENDPOINT.API_SPOT_TICKER, {method: FETCH_METHOD.GET, headers: header, body: null})
    if (!response) return null;
    if (response.status !== 200) {
        console.log("[BINANCE] getInitialInfo error: ", response);
        return null;
    }
    let jsonData = null;
    try {
        jsonData = await response.json();
    } catch (err: any) {
        console.log("err: ", err)
    }
    let aggTradeInfos: IAggTradeInfo[] = []
    let tickerRes: IBinanceTickerResponse[] = jsonData;
    // console.log("[SPOT] reckerRes: ", tickerRes)
    const codesMap = new Map<string, string>()
    for (const ticker of tickerRes) {   
        const {symbol, coinPair, market, marketCurrency} = parseCoinInfoFromCoinPair(EXCHANGE.BINANCE, MARKET_TYPE.SPOT, ticker.symbol)        
        // console.log(`symbol: ${symbol}, coinPair: ${coinPair}, market: ${market}, marketCurrency: ${marketCurrency}`)
        if (!symbol || symbol === "" || parseFloat(ticker.lastPrice) === 0) {
            // console.log("skip ticker: ", ticker)
            continue;
        }
        let aggTradeInfo: IAggTradeInfo = {
            exchange: EXCHANGE.BINANCE,
            marketInfo: {exchange: EXCHANGE.BINANCE, market: market as MARKET, marketType: MARKET_TYPE.SPOT, marketCurrency: marketCurrency as MARKET_CURRENCY},
            symbol: symbol,
            coinPair: coinPair,
            price: parseFloat(ticker.lastPrice),
            bestBidPrice: parseFloat(ticker.bidPrice),
            bestBidQty: parseFloat(ticker.bidQty),
            bestAskPrice: parseFloat(ticker.askPrice),
            bestAskQty: parseFloat(ticker.askQty),
            accVolume: undefined,
            accVolume_24h: parseFloat(ticker.volume),
            accTradePrice: undefined,
            accTradePrice_24h: parseFloat(ticker.quoteVolume),
            preClosingPrice: parseFloat(ticker.openPrice),
            askBid: ASK_BID.NONE,    
            change: parseFloat(ticker.priceChange),
            changeRate: parseFloat(ticker.priceChangePercent),
            high_24h: parseFloat(ticker.highPrice),
            low_24h: parseFloat(ticker.lowPrice),
            timestamp: ticker.closeTime
        }
        aggTradeInfos.push(aggTradeInfo)
        codesMap.set(aggTradeInfo.coinPair, ticker.symbol);
    }
    listener(aggTradeInfos);

    let ws: ReconnectingWebSocket | undefined;
    let payload: BinanceSocketPayload = {
        id: 1,
        method: "SUBSCRIBE",
        params: [
            "!ticker@arr",
        ],
    }
    ws?.close();
    ws = new ReconnectingWebSocket(spotMarketStreamUrlProvider, [], options);
    ws.addEventListener('message', (payload) => {
        try {
            const res: any = JSON.parse(payload.data);
            if (!res) return;
            if (res?.e === 'ping') {
                console.log("get ping!!!!! res: ", res)
                ws?.send(JSON.stringify({ pong: res.ping ?? "" }));
                console.log("send pong!!!!!")
            } else if (res.id) {
                console.log(res)
                return;
            }
            const tickerRes: IBinanceWSTickerResponse[] = res;
            for (const ticker of tickerRes) {
                if (ticker.e !== "24hrTicker") continue;
                if (codesMap.has(ticker.s) === false) continue;
                const {symbol, coinPair, market, marketCurrency} = parseCoinInfoFromCoinPair(EXCHANGE.BINANCE, MARKET_TYPE.SPOT, ticker.s)
                let aggTradeInfo: IAggTradeInfo = {
                    exchange: EXCHANGE.BINANCE,
                    marketInfo: {exchange: EXCHANGE.BINANCE, market: market as MARKET, marketType: MARKET_TYPE.SPOT, marketCurrency: marketCurrency as MARKET_CURRENCY},
                    symbol: symbol,
                    coinPair: coinPair,
                    price: parseFloat(ticker.c),
                    bestBidPrice: parseFloat(ticker.b ?? "0"),
                    bestBidQty: parseFloat(ticker.B ?? "0"),
                    bestAskPrice: parseFloat(ticker.a ?? "0"),
                    bestAskQty: parseFloat(ticker.A ?? "0"),
                    accVolume: undefined,
                    accVolume_24h: parseFloat(ticker.v),
                    accTradePrice: undefined,
                    accTradePrice_24h: parseFloat(ticker.q),
                    preClosingPrice: parseFloat(ticker.o),
                    askBid: ASK_BID.NONE,    
                    change: parseFloat(ticker.p),
                    changeRate: parseFloat(ticker.P),
                    high_24h: parseFloat(ticker.h),
                    low_24h: parseFloat(ticker.l),
                    timestamp: ticker.E
                }
                listener([aggTradeInfo]);
            }
        }
        catch (err) {
            console.log("err:" , err)
        }
    })
    ws.onopen = (event) => {
        console.log("[BINANCE] onopen", event)
        try {
            ws?.send(`${JSON.stringify(payload)}`)
        } catch (err: any) {
            console.error("[BINANCE] tickerWS.onopen err: ", err)
        }
        
    };
    ws.onerror = (event) => {
        try {
            console.log("[BINANCE] onerror", event)
        } catch (err: any) {
            console.error("[BINANCE] tickerWS.onerror err: ", err)
        }
        
    };
    ws.onclose = (event) => {
        try {
            console.log("[BINANCE] onclose", event)
        } catch (err: any) {
            console.error("[BINANCE] tickerWS.onclose err: ", err)
        }
    };
    return ws;
}

export const binance_usd_m_future_startTickerWebsocket = async (codes: string[], options: any, listener: any) => {
    // const response = await fetch(BINANCE_ENDPOINT.API_USD_M_FUTURE_TICKER + `/24hr?symbols=${JSON.stringify(codes)}`, {
    let promises: any = [];
    promises.push(fetch(BINANCE_ENDPOINT.API_USD_M_FUTURE_TICKER, {method: FETCH_METHOD.GET, headers: header, body: null}))
    promises.push(fetch(BINANCE_ENDPOINT.API_USD_M_FUTURE_BOOK_TICKER, {method: FETCH_METHOD.GET, headers: header, body: null}))
    const promiseRet = await Promise.all(promises)

    let bookTickerMap: Map<string, IBinanceBookTickerResponse> = new Map<string, IBinanceBookTickerResponse>();
    let aggTradeInfoMap: Map<string, IAggTradeInfo> = new Map<string, IAggTradeInfo>();
    
    const response_1 = promiseRet[0]
    if (!response_1) return null;
    if (response_1.status !== 200) {
        console.log("[BINANCE] getInitialInfo response_1 error: ", response_1);
        return null;
    }
    let jsonData = null;
    try {
        jsonData = await response_1.json();
    } catch (err: any) {
        console.log("err: ", err)
    }
    let aggTradeInfos: IAggTradeInfo[] = []
    let tickerRes: IBinanceTickerResponse[] = jsonData;
    // console.log("[USDM_PERF] reckerRes: ", tickerRes)

    const response_2 = promiseRet[1]
    if (!response_2) return null;
    if (response_2.status !== 200) {
        console.log("[BINANCE] getInitialInfo response_2 error: ", response_2);
        return null;
    }
    jsonData = null;
    try {
        jsonData = await response_2.json();
    } catch (err: any) {
        console.log("err: ", err)
    }
    let bookTickerRes: IBinanceBookTickerResponse[] = jsonData;
    // console.log("[USDM_PERF] bookTickerRes: ", bookTickerRes)
    bookTickerRes?.forEach((ticker: IBinanceBookTickerResponse) => {
        bookTickerMap.set(ticker.symbol, ticker)
    })

    const codesMap = new Map<string, string>()
    for (const ticker of tickerRes) {   
        const {symbol, coinPair, market, marketCurrency} = parseCoinInfoFromCoinPair(EXCHANGE.BINANCE, MARKET_TYPE.USD_M_FUTURE_PERF, ticker.symbol)        
        if (!symbol || symbol === "" || parseFloat(ticker.lastPrice) === 0) {
            // console.log("skip ticker: ", ticker)
            continue;
        }
        const bookTicker: IBinanceBookTickerResponse | undefined = bookTickerMap.get(ticker.symbol)
        let aggTradeInfo: IAggTradeInfo = {
            exchange: EXCHANGE.BINANCE,
            marketInfo: {exchange: EXCHANGE.BINANCE, market: market as MARKET, marketType: MARKET_TYPE.USD_M_FUTURE_PERF, marketCurrency: marketCurrency as MARKET_CURRENCY},
            symbol: symbol,
            coinPair: coinPair,
            price: parseFloat(ticker.lastPrice),
            bestBidPrice: parseFloat(bookTicker?.bidPrice ?? "0"),
            bestBidQty: parseFloat(bookTicker?.bidQty ?? "0"),
            bestAskPrice: parseFloat(bookTicker?.askPrice ?? "0"),
            bestAskQty: parseFloat(bookTicker?.askQty ?? "0"),
            accVolume: undefined,
            accVolume_24h: parseFloat(ticker.volume),
            accTradePrice: undefined,
            accTradePrice_24h: parseFloat(ticker.quoteVolume),
            preClosingPrice: parseFloat(ticker.openPrice),
            askBid: ASK_BID.NONE,    
            change: parseFloat(ticker.priceChange),
            changeRate: parseFloat(ticker.priceChangePercent),
            high_24h: parseFloat(ticker.highPrice),
            low_24h: parseFloat(ticker.lowPrice),
            timestamp: ticker.closeTime
        }
        aggTradeInfos.push(aggTradeInfo)
        codesMap.set(aggTradeInfo.coinPair, ticker.symbol);
        aggTradeInfoMap.set(aggTradeInfo.coinPair, aggTradeInfo)
    }
    listener(aggTradeInfos);

    let ws: ReconnectingWebSocket | undefined;
    let payload: BinanceSocketPayload = {
        id: 1,
        method: "SUBSCRIBE",
        params: [
            "!ticker@arr",
            "!bookTicker"
        ],
    }
    ws?.close();
    ws = new ReconnectingWebSocket(usdMfutureMarketStreamUrlProvider, [], options);
    ws.addEventListener('message', (payload) => {
        try {
            let res: any = JSON.parse(payload.data);
            if (!res) return;
            if (res?.e === 'ping') {
                console.log("get ping!!!!! res: ", res)
                ws?.send(JSON.stringify({ pong: res.ping ?? "" }));
                console.log("send pong!!!!!")
            } else if (res.id) {
                console.log(res)
                return;
            }           
            // bookticker 는 하나씩 온다. 
            if (res.e) {
                res = [res]
            }
            let tickerRes: IBinanceWSTickerResponse[] = res;
            for (const ticker of tickerRes) {
                if (codesMap.has(ticker.s) === false) continue;
                const {symbol, coinPair, market, marketCurrency} = parseCoinInfoFromCoinPair(EXCHANGE.BINANCE, MARKET_TYPE.USD_M_FUTURE_PERF, ticker.s)
                const preAggTradeInfo = aggTradeInfoMap.get(coinPair)
                if (!preAggTradeInfo) continue;
                if (ticker.e === "24hrTicker") {
                    const bookTicker: IBinanceBookTickerResponse | undefined = bookTickerMap.get(ticker.s)
                    let aggTradeInfo: IAggTradeInfo = {
                        exchange: EXCHANGE.BINANCE,
                        marketInfo: {exchange: EXCHANGE.BINANCE, market: market as MARKET, marketType: MARKET_TYPE.USD_M_FUTURE_PERF, marketCurrency: marketCurrency as MARKET_CURRENCY},
                        symbol: symbol,
                        coinPair: coinPair,
                        price: parseFloat(ticker.c),
                        bestBidPrice: bookTicker?.bidPrice? parseFloat(bookTicker?.bidPrice ?? "0") : preAggTradeInfo.bestBidPrice,
                        bestBidQty: bookTicker?.bidQty? parseFloat(bookTicker?.bidQty ?? "0"): preAggTradeInfo.bestBidQty,
                        bestAskPrice: bookTicker?.askPrice? parseFloat(bookTicker?.askPrice ?? "0"): preAggTradeInfo.bestAskPrice,
                        bestAskQty: bookTicker?.askQty? parseFloat(bookTicker?.askQty ?? "0"): preAggTradeInfo.bestAskQty,
                        accVolume: undefined,
                        accVolume_24h: parseFloat(ticker.v),
                        accTradePrice: undefined,
                        accTradePrice_24h: parseFloat(ticker.q),
                        preClosingPrice: parseFloat(ticker.o),
                        askBid: ASK_BID.NONE,    
                        change: parseFloat(ticker.p),
                        changeRate: parseFloat(ticker.P),
                        high_24h: parseFloat(ticker.h),
                        low_24h: parseFloat(ticker.l),
                        timestamp: ticker.E
                    }
                    aggTradeInfoMap.set(coinPair, aggTradeInfo)
                    // console.log("aggTradeInfo: ", aggTradeInfo)
                    listener([aggTradeInfo]);
                }
                if (ticker.e === "bookTicker") {
                    let aggTradeInfo: IAggTradeInfo = _.cloneDeep(preAggTradeInfo);
                    aggTradeInfo.bestBidPrice = parseFloat(ticker.b ?? "0");
                    aggTradeInfo.bestBidQty = parseFloat(ticker.B ?? "0");
                    aggTradeInfo.bestAskPrice = parseFloat(ticker.a ?? "0");
                    aggTradeInfo.bestAskQty = parseFloat(ticker.A ?? "0");
                    // console.log("ddd aggTradeInfo: ", aggTradeInfo);
                    //aggTradeInfoMap.set(coinPair, aggTradeInfo)
                    if (ticker.s && ticker.b && ticker.B && ticker.a && ticker.A) {
                        let bookTickerRes: IBinanceBookTickerResponse = {
                            symbol: ticker.s ?? aggTradeInfo.symbol,
                            bidPrice: ticker.b?? aggTradeInfo.bestBidPrice,
                            bidQty: ticker.B?? aggTradeInfo.bestBidQty,
                            askPrice: ticker.a?? "",
                            askQty: ticker.A?? "",
                            time: ticker.E
                        }
                        bookTickerMap.set(ticker.s, bookTickerRes)
                    }
                    listener([aggTradeInfo]);
                }
            }
        }
        catch (err) {
            console.log("err:" , err)
        }
    })
    ws.onopen = (event) => {
        console.log("[BINANCE] onopen", event)
        try {
            ws?.send(`${JSON.stringify(payload)}`)
        } catch (err: any) {
            console.error("[BINANCE] tickerWS.onopen err: ", err)
        }
        
    };
    ws.onerror = (event) => {
        try {
            console.log("[BINANCE] onerror", event)
        } catch (err: any) {
            console.error("[BINANCE] tickerWS.onerror err: ", err)
        }
        
    };
    ws.onclose = (event) => {
        try {
            console.log("[BINANCE] onclose", event)
        } catch (err: any) {
            console.error("[BINANCE] tickerWS.onclose err: ", err)
        }
    };
    return ws;
}

export const binance_coin_m_future_startTickerWebsocket = async (codes: string[], options: any, listener: any) => {
    // const response = await fetch(BINANCE_ENDPOINT.API_COIN_M_FUTURE_TICKER + `/24hr?symbols=${JSON.stringify(codes)}`, {
    let promises: any = [];
    promises.push(fetch(BINANCE_ENDPOINT.API_COIN_M_FUTURE_TICKER, {method: FETCH_METHOD.GET, headers: header, body: null}))
    promises.push(fetch(BINANCE_ENDPOINT.API_COIN_M_FUTURE_BOOK_TICKER, {method: FETCH_METHOD.GET, headers: header, body: null}))
    const promiseRet = await Promise.all(promises)

    let bookTickerMap: Map<string, IBinanceBookTickerResponse> = new Map<string, IBinanceBookTickerResponse>();
    let aggTradeInfoMap: Map<string, IAggTradeInfo> = new Map<string, IAggTradeInfo>();
    
    const response_1 = promiseRet[0]
    if (!response_1) return null;
    if (response_1.status !== 200) {
        console.log("[BINANCE] getInitialInfo response_1 error: ", response_1);
        return null;
    }
    let jsonData = null;
    try {
        jsonData = await response_1.json();
    } catch (err: any) {
        console.log("err: ", err)
    }
    let aggTradeInfos: IAggTradeInfo[] = []
    let tickerRes: IBinanceTickerResponse[] = jsonData;
    // console.log("[USDM_PERF] reckerRes: ", tickerRes)

    const response_2 = promiseRet[1]
    if (!response_2) return null;
    if (response_2.status !== 200) {
        console.log("[BINANCE] getInitialInfo response_2 error: ", response_2);
        return null;
    }
    jsonData = null;
    try {
        jsonData = await response_2.json();
    } catch (err: any) {
        console.log("err: ", err)
    }
    let bookTickerRes: IBinanceBookTickerResponse[] = jsonData;
    // console.log("[USDM_PERF] bookTickerRes: ", bookTickerRes)
    bookTickerRes?.forEach((ticker: IBinanceBookTickerResponse) => {
        bookTickerMap.set(ticker.symbol, ticker)
    })

    const codesMap = new Map<string, string>()
    for (const ticker of tickerRes) {   
        const {symbol, coinPair, market, marketCurrency} = parseCoinInfoFromCoinPair(EXCHANGE.BINANCE, MARKET_TYPE.COIN_M_FUTURE_PERF, ticker.symbol)        
        if (!symbol || symbol === "" || parseFloat(ticker.lastPrice) === 0) {
            // console.log("skip ticker: ", ticker)
            continue;
        }
        const bookTicker: IBinanceBookTickerResponse | undefined = bookTickerMap.get(ticker.symbol)
        let aggTradeInfo: IAggTradeInfo = {
            exchange: EXCHANGE.BINANCE,
            marketInfo: {exchange: EXCHANGE.BINANCE, market: market as MARKET, marketType: MARKET_TYPE.COIN_M_FUTURE_PERF, marketCurrency: marketCurrency as MARKET_CURRENCY},
            symbol: symbol,
            coinPair: coinPair,
            price: parseFloat(ticker.lastPrice),
            bestBidPrice: parseFloat(bookTicker?.bidPrice ?? "0"),
            bestBidQty: parseFloat(bookTicker?.bidQty ?? "0"),
            bestAskPrice: parseFloat(bookTicker?.askPrice ?? "0"),
            bestAskQty: parseFloat(bookTicker?.askQty ?? "0"),
            accVolume: undefined,
            accVolume_24h: parseFloat(ticker.volume),
            accTradePrice: undefined,
            accTradePrice_24h: parseFloat(ticker.quoteVolume),
            preClosingPrice: parseFloat(ticker.openPrice),
            askBid: ASK_BID.NONE,    
            change: parseFloat(ticker.priceChange),
            changeRate: parseFloat(ticker.priceChangePercent),
            high_24h: parseFloat(ticker.highPrice),
            low_24h: parseFloat(ticker.lowPrice),
            timestamp: ticker.closeTime
        }
        aggTradeInfos.push(aggTradeInfo)
        codesMap.set(aggTradeInfo.coinPair, ticker.symbol);
        aggTradeInfoMap.set(aggTradeInfo.coinPair, aggTradeInfo)
    }
    listener(aggTradeInfos);

    let ws: ReconnectingWebSocket | undefined;
    let payload: BinanceSocketPayload = {
        id: 1,
        method: "SUBSCRIBE",
        params: [
            "!ticker@arr",
            "!bookTicker"
        ],
    }
    ws?.close();
    ws = new ReconnectingWebSocket(coinMfutureMarketStreamUrlProvider, [], options);
    ws.addEventListener('message', (payload) => {
        try {
            let res: any = JSON.parse(payload.data);
            if (!res) return;
            if (res?.e === 'ping') {
                console.log("get ping!!!!! res: ", res)
                ws?.send(JSON.stringify({ pong: res.ping ?? "" }));
                console.log("send pong!!!!!")
            } else if (res.id) {
                console.log(res)
                return;
            }            
            // bookticker 는 하나씩 온다. 
            if (res.e) {
                res = [res]
            }
            const tickerRes: IBinanceWSTickerResponse[] = res;
            for (const ticker of tickerRes) {
                if (codesMap.has(ticker.s) === false) continue;
                const {symbol, coinPair, market, marketCurrency} = parseCoinInfoFromCoinPair(EXCHANGE.BINANCE, MARKET_TYPE.COIN_M_FUTURE_PERF, ticker.s)
                const preAggTradeInfo = aggTradeInfoMap.get(coinPair)
                if (!preAggTradeInfo) continue;
                const bookTicker: IBinanceBookTickerResponse | undefined = bookTickerMap.get(ticker.s)
                if (ticker.e === "24hrTicker") {
                    let aggTradeInfo: IAggTradeInfo = {
                        exchange: EXCHANGE.BINANCE,
                        marketInfo: {exchange: EXCHANGE.BINANCE, market: market as MARKET, marketType: MARKET_TYPE.COIN_M_FUTURE_PERF, marketCurrency: marketCurrency as MARKET_CURRENCY},
                        symbol: symbol,
                        coinPair: coinPair,
                        price: parseFloat(ticker.c),
                        bestBidPrice: bookTicker?.bidPrice? parseFloat(bookTicker?.bidPrice ?? "0") : preAggTradeInfo.bestBidPrice,
                        bestBidQty: bookTicker?.bidQty? parseFloat(bookTicker?.bidQty ?? "0"): preAggTradeInfo.bestBidQty,
                        bestAskPrice: bookTicker?.askPrice? parseFloat(bookTicker?.askPrice ?? "0"): preAggTradeInfo.bestAskPrice,
                        bestAskQty: bookTicker?.askQty? parseFloat(bookTicker?.askQty ?? "0"): preAggTradeInfo.bestAskQty,
                        accVolume: undefined,
                        accVolume_24h: parseFloat(ticker.v),
                        accTradePrice: undefined,
                        accTradePrice_24h: parseFloat(ticker.q),
                        preClosingPrice: parseFloat(ticker.o),
                        askBid: ASK_BID.NONE,    
                        change: parseFloat(ticker.p),
                        changeRate: parseFloat(ticker.P),
                        high_24h: parseFloat(ticker.h),
                        low_24h: parseFloat(ticker.l),
                        timestamp: ticker.E
                    }
                    aggTradeInfoMap.set(coinPair, aggTradeInfo)
                    // console.log("aggTradeInfo: ", aggTradeInfo)
                    listener([aggTradeInfo]);
                }
                if (ticker.e === "bookTicker") {
                    let aggTradeInfo: IAggTradeInfo = _.cloneDeep(preAggTradeInfo);
                    aggTradeInfo.bestBidPrice = parseFloat(ticker.b ?? "0");
                    aggTradeInfo.bestBidQty = parseFloat(ticker.B ?? "0");
                    aggTradeInfo.bestAskPrice = parseFloat(ticker.a ?? "0");
                    aggTradeInfo.bestAskQty = parseFloat(ticker.A ?? "0");
                    // console.log("ddd aggTradeInfo: ", aggTradeInfo);
                    //aggTradeInfoMap.set(coinPair, aggTradeInfo)
                    if (ticker.s && ticker.b && ticker.B && ticker.a && ticker.A) {
                        let bookTickerRes: IBinanceBookTickerResponse = {
                            symbol: ticker.s ?? aggTradeInfo.symbol,
                            bidPrice: ticker.b?? aggTradeInfo.bestBidPrice,
                            bidQty: ticker.B?? aggTradeInfo.bestBidQty,
                            askPrice: ticker.a?? "",
                            askQty: ticker.A?? "",
                            time: ticker.E
                        }
                        bookTickerMap.set(ticker.s, bookTickerRes)
                    }
                    listener([aggTradeInfo]);
                }
            }
        }
        catch (err) {
            console.log("err:" , err)
        }
    })
    ws.onopen = (event) => {
        console.log("[BINANCE] onopen", event)
        try {
            ws?.send(`${JSON.stringify(payload)}`)
        } catch (err: any) {
            console.error("[BINANCE] tickerWS.onopen err: ", err)
        }
        
    };
    ws.onerror = (event) => {
        try {
            console.log("[BINANCE] onerror", event)
        } catch (err: any) {
            console.error("[BINANCE] tickerWS.onerror err: ", err)
        }
        
    };
    ws.onclose = (event) => {
        try {
            console.log("[BINANCE] onclose", event)
        } catch (err: any) {
            console.error("[BINANCE] tickerWS.onclose err: ", err)
        }
    };
    return ws;
}

export const binance_usd_m_future_startOrderWebsocket = async (codes: string[], options: any, listener: any) => {

}

export const binance_coin_m_future_startOrderWebsocket = async (codes: string[], options: any, listener: any) => {

}
