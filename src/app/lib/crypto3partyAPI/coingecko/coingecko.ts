"use client"

import { EXCHANGE, FETCH_METHOD } from "@/config/enum";
import { COINGECKO_ENDPOINT, ICoinGeckoExhcnageTicker } from "./ICoingecko";

export const coinGecko_getExchangeTickers = async (exchange: EXCHANGE) => {
    const response = await fetch(COINGECKO_ENDPOINT.API_ALL_COINS, {
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
        console.log("[COINGECKO] getExchangeTicker error: ", response);
        return null;
    }
    const jsonData: ICoinGeckoExhcnageTicker = await response.json();
    return jsonData;
}