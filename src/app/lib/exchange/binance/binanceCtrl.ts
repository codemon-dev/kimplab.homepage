"use client"

import { v4 as uuidv4 } from "uuid";
import { ASK_BID, EXCHANGE, FETCH_METHOD, MARKET } from "@/config/enum";
import { BINANCE_ENDPOINT, BinanceSocketPayload, IBinanceAggTrade, IBinanceTickerResponse, IBinanceWSTickerResponse } from "./IBinance";
import ReconnectingWebSocket from "reconnecting-websocket";
import { IAggTradeInfo } from "@/config/interface";
import { parseCoinInfoFromCoinPair } from "@/app/helper/cryptoHelper";

const BINANCE_SPOT_API_ADDR = "https://api.binance.com"
const BINANCE_SPOT_WS_ADDR = "wss://stream.binance.com:9443/ws"
const BINANCE_FUTURE_WS_ADDR = "wss://stream.binance.com:9443/ws"


export const getInitialInfoBinance = async () => {
    const response = await fetch(BINANCE_ENDPOINT.API_EXCHANGEINFO, {
        method: FETCH_METHOD.GET,
        headers: {
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
        body: null})
    if (!response) {
        return null;
    }
    if (response.status !== 200) {
        console.log("[BINANCE] getInitialInfo error: ", response);
        return null;
    }
    const jsonData = await response.json();
    return jsonData;
    
    // response.forEach((obj: any) => {
    //     const {symbol, coinPair, market} = parseCoinInfoFromCoinPair(EXCHANGE.UPBIT, obj.market)
    //     let info: IExchangeCoinInfo = {
    //         exchange: EXCHANGE.UPBIT,
    //         symbol,
    //         coinPair,
    //         market: market as MARKET,
    //         // network: "", // string[] parse해야 함.
    //         name_kor: obj.korean_name,
    //         name_eng: obj.english_name,
    //         warning: obj.market_warning === "NONE"? false: true,
    //         // trading: true,
    //         // deposit: true,
    //         // withdraw: true,
    //         // numOfDepositConfirm: 0,
    //         // numOfWithdrawConfirm: 0,
    //         // limitTradingFee: 0,
    //         // marketTradingFee: 0,
    //         // depositFee: 0,
    //         // withdrawFee: 0,
    //     }
    //     upbitExchangeInfos.push(info);
    // });
}

const spotStreamUrlProvider = async () => {
    return BINANCE_SPOT_WS_ADDR;
};

const futureStreamUrlProvider = async () => {
    return BINANCE_FUTURE_WS_ADDR;
};

// const isPongResponse = (object: any): object is UPBIT_PONG_RESPONSE => {
//     return 'status' in object;
// }

export const binance_spot_startTickerWebsocket = async (codes: string[], options: any, listener: any) => {
    // const response = await fetch(BINANCE_ENDPOINT.API_TICKER + `/24hr?symbols=${JSON.stringify(codes)}`, {
    const response = await fetch(BINANCE_ENDPOINT.API_TICKER, {
        method: FETCH_METHOD.GET,
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
            "Content-Encoding": "gzip",
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
        body: null})
    if (!response) {
        return null;
    }
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
    // console.log("reckerRes: ", tickerRes)
    const codesMap = new Map<string, string>()
    for (const ticker of tickerRes) {   
        const {symbol, coinPair, market} = parseCoinInfoFromCoinPair(EXCHANGE.BINANCE, ticker.symbol)        
        if (!symbol || symbol === "" || parseFloat(ticker.lastPrice) === 0) {
            // console.log("skip ticker: ", ticker)
            continue;
        }
        let aggTradeInfo: IAggTradeInfo = {
            exchange: EXCHANGE.BINANCE,
            market: market as MARKET,
            symbol: symbol,
            coinPair: coinPair,
            price: parseFloat(ticker.lastPrice),
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
    ws = new ReconnectingWebSocket(spotStreamUrlProvider, [], options);
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
                const {symbol, coinPair, market} = parseCoinInfoFromCoinPair(EXCHANGE.BINANCE, ticker.s)
                let aggTradeInfo: IAggTradeInfo = {
                    exchange: EXCHANGE.BINANCE,
                    market: market as MARKET,
                    symbol: symbol,
                    coinPair: coinPair,
                    price: parseFloat(ticker.c),
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