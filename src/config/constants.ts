// export const PROXY_ANYWHERE_URL = "https://cors-anywhere.herokuapp.com/"
// export const PROXY_ANYWHERE_URL = "http://localhost:8080/"

import { EXCHANGE, MARKET } from "./enum";

export const ExchangeDefaultInfo = {
    "upbit": {
        exchange: EXCHANGE.UPBIT,
        markets: [MARKET.KRW, MARKET.BTC, MARKET.USDT]
    },
    "binance": {
        exchange: EXCHANGE.BINANCE,
        markets: [MARKET.BUSD, MARKET.TUSD, MARKET.USDT, MARKET.USD_PERP, MARKET.USDT_PERP]
    },
}