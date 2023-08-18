// export const PROXY_ANYWHERE_URL = "https://cors-anywhere.herokuapp.com/"
// export const PROXY_ANYWHERE_URL = "http://localhost:8080/"

import { EXCHANGE, MARKET } from "./enum";

export const ExchangeDefaultInfo = {
    "upbit": {
        exchange: { value: EXCHANGE.UPBIT, label: "업비트"},
        markets: [
            { value: MARKET.KRW, label: MARKET.KRW },
            { value: MARKET.BTC, label: MARKET.BTC },
            { value: MARKET.USDT, label: MARKET.USDT },
        ]
    },
    "bithumb": {
        exchange: { value: EXCHANGE.BITHUMB, label: "빗썸" },
        markets: [
            { value: MARKET.KRW, label: MARKET.KRW },
            { value: MARKET.BTC, label: MARKET.BTC },
            { value: MARKET.USDT, label: MARKET.USDT },
        ]
    },
    "binance": {
        exchange: { value: EXCHANGE.BINANCE, label: "Binance" },
        markets: [
            { value: MARKET.BUSD, label: MARKET.BUSD },
            { value: MARKET.TUSD, label: MARKET.TUSD },
            { value: MARKET.USDT, label: MARKET.USDT },
            { value: MARKET.USDT_PERP, label: MARKET.USDT_PERP },
            { value: MARKET.USD_PERP, label: MARKET.USD_PERP },
        ]
    },
    "bybit": {
        exchange: { value: EXCHANGE.BYBIT, label: "ByBit" },
        markets: [
            { value: MARKET.USDT, label: MARKET.USDT },
        ]
    },
}