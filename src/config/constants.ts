// export const PROXY_ANYWHERE_URL = "https://cors-anywhere.herokuapp.com/"
// export const PROXY_ANYWHERE_URL = "http://localhost:8080/"

import { EXCHANGE, MARKET } from "./enum";

export const ExchangeDefaultInfo = {
    "upbit": {
        exchange: { value: EXCHANGE.UPBIT, lable: "업비트" },
        markets: [
            { value: MARKET.KRW, lable: MARKET.KRW },
            { value: MARKET.BTC, lable: MARKET.BTC },
            { value: MARKET.USDT, lable: MARKET.USDT },
        ]
    },
    "bithumb": {
        exchange: { value: EXCHANGE.BITHUMB, lable: "빗썸" },
        markets: [
            { value: MARKET.KRW, lable: MARKET.KRW },
            { value: MARKET.BTC, lable: MARKET.BTC },
            { value: MARKET.USDT, lable: MARKET.USDT },
        ]
    },
    "binance": {
        exchange: { value: EXCHANGE.BINANCE, lable: "Binance" },
        markets: [
            { value: MARKET.BUSD, lable: MARKET.BUSD },
            { value: MARKET.TUSD, lable: MARKET.TUSD },
            { value: MARKET.USDT, lable: MARKET.USDT },
            { value: MARKET.USDT_PERP, lable: MARKET.USDT_PERP },
            { value: MARKET.USD_PERP, lable: MARKET.USD_PERP },
        ]
    },
    "bybit": {
        exchange: { value: EXCHANGE.BYBIT, lable: "ByBit" },
        markets: [
            { value: MARKET.USDT, lable: MARKET.USDT },
        ]
    },
}