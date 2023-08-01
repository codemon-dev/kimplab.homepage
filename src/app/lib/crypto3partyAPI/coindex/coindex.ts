"use client"

import { FETCH_METHOD } from "@/config/enum";
import { COINDEX_ENDPOINT, ICoinDexAllCoins, ICoinDexAllCoinsImgPath } from "./ICoindex";

export const coindex_getAllCoins = async () => {
    const response = await fetch(COINDEX_ENDPOINT.API_ALL_COINS, {
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
    const jsonData: ICoinDexAllCoins[] = await response.json();
    // console.log("jsonData: ", jsonData);
    return jsonData;
}

export const coindex_getAllCoinsImgPath = async () => {
    const response = await fetch(COINDEX_ENDPOINT.API_ALL_COINS + `cache/all_coins.json`, {
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
    const jsonData: ICoinDexAllCoins[] = await response.json();
    let coinsImgsPath: ICoinDexAllCoinsImgPath[] = []
    jsonData.forEach((obj: ICoinDexAllCoins) => {
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