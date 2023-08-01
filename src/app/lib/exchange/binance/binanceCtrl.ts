"use client"

import { FETCH_METHOD } from "@/config/enum";
import { BINANCE_ENDPOINT, IBinanceAggTrade } from "./IBinance";

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

export const startWebSocket = () => {
    
}