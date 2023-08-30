"use client"

import { FETCH_METHOD } from "@/config/enum";
import { COINCDEX_ENDPOINT, ICoinCodexAllCoins, ICoinCodexAllCoinsImgPath } from "./ICoindex";
import { IDominanceChartInfo } from "@/config/interface";

export const coindex_getAllCoins = async () => {
    const response = await fetch(COINCDEX_ENDPOINT.API_ALL_COINS, {
        method: FETCH_METHOD.GET,
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "accept": "application/json",
        },
        body: null})
    if (!response) {
        return null;
    }
    if (response.status !== 200) {
        console.log("[COINDEX] coindex_getAllCoins error: ", response);
        return null;
    }
    const jsonData: ICoinCodexAllCoins[] = await response.json();
    // console.log("jsonData: ", jsonData);
    return jsonData;
}

export const coindex_getDominance = async (numOfSample: number = 48) => {
    let dominanceInfo: IDominanceChartInfo = {
        chart: [], 
        curDominance: 0,
        timestamp: 0,
    }
    let promises = []    
    promises.push(coindex_getCoinChart("1D", numOfSample))
    promises.push(coindex_getCoinChart("1D", numOfSample, "BTC"))
    const promiseRet = await Promise.all(promises)
    if (!promiseRet[0] || !promiseRet[1] || promiseRet[0].length === 0 || promiseRet[1].length === 0) {
        console.error("[COINDEX] coindex_getDominance error: ", promiseRet);
        return dominanceInfo;
    }

    promiseRet[0].forEach((_: any, index: number) => {
        if (promiseRet[0][index][0] != promiseRet[1][index][0]) return;
        let allMarketCap = promiseRet[0][index][3]
        let btcMarketCap = promiseRet[1][index][2]
        let timestamp = promiseRet[0][index][0]
        dominanceInfo.chart.push({
            dominance: btcMarketCap / allMarketCap,
            timestamp
        })        
    })
    let allMarketCap = promiseRet[0][promiseRet[0].length - 1][3]
    let btcMarketCap = promiseRet[1][promiseRet[1].length - 1][2]
    dominanceInfo.chart.push({
        dominance: btcMarketCap / allMarketCap,
        timestamp: promiseRet[1][promiseRet[1].length - 1][0]
    })        

    if (dominanceInfo.chart.length > 0) {
        dominanceInfo.curDominance = dominanceInfo.chart[dominanceInfo.chart.length - 1].dominance;
        dominanceInfo.timestamp = dominanceInfo.chart[dominanceInfo.chart.length - 1].timestamp;
    }
    return dominanceInfo
}

export const coindex_getCoinChart = async (period: string = "1D", numOfSample: number = 48, symbol?: string) => {
    let url = symbol
        ? `${COINCDEX_ENDPOINT.API_GET_COIN_CHARTS}?charts=${period}&coins=${symbol}&include=market_cap&samples=${numOfSample}&t=2822264`
        : `${COINCDEX_ENDPOINT.API_GET_COIN_CHARTS}?charts=${period}&coins=SUM_ALL_COINS&include=market_cap%2Cvolume&samples=${numOfSample}&t=2822263`
    const response = await fetch(url, {
        method: FETCH_METHOD.GET,
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "accept": "application/json",
        },
        body: null})
    if (!response) {
        return null;
    }
    if (response.status !== 200) {
        console.log("[COINDEX] coindex_getCoinChart error: ", response);
        return null;
    }
    const jsonData: any = await response.json();
    // console.log("jsonData: ", jsonData);
    return symbol? jsonData[symbol][period]: jsonData["SUM_ALL_COINS"][period];
}

export const coindex_getAllCoinsImgPath = async () => {
    const response = await fetch(COINCDEX_ENDPOINT.API_ALL_COINS + `cache/all_coins.json`, {
        method: FETCH_METHOD.GET,
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "accept": "application/json",
        },
        body: null})
    if (!response) {
        return null;
    }
    if (response.status !== 200) {
        console.log("[COINDEX] coindex_getAllCoins error: ", response);
        return null;
    }
    const jsonData: ICoinCodexAllCoins[] = await response.json();
    let coinsImgsPath: ICoinCodexAllCoinsImgPath[] = []
    jsonData.forEach((obj: ICoinCodexAllCoins) => {
        coinsImgsPath.push({symbol: obj.symbol, imgId: obj.image_id})
    })
    // console.log("coinsImgsPath: ", newJson);
    return coinsImgsPath;
}

export const coindex_getSymbolImg = (symbols: string[]) => {
    let imgs: string[] = []
    symbols.forEach((obj: string) => {
        imgs.push()
    })
}