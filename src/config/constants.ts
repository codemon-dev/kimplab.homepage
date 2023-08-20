// export const PROXY_ANYWHERE_URL = "https://cors-anywhere.herokuapp.com/"
// export const PROXY_ANYWHERE_URL = "http://localhost:8080/"

import { EXCHANGE, MARKET, MARKET_CURRENCY, MARKET_TYPE } from "./enum";

export const ExchangeDefaultInfo = {
    "upbit": {
        exchange: { value: EXCHANGE.UPBIT, label: "업비트"},        
        markets: [
            { value: MARKET.SPOT_KRW,  label: "원화 마켓", marketInfo: {exchange: EXCHANGE.UPBIT, market: MARKET.SPOT_KRW, marketType: MARKET_TYPE.SPOT, marketCurrency: MARKET_CURRENCY.KRW }},
            { value: MARKET.SPOT_BTC,  label: "BTC 마켓", marketInfo: {exchange: EXCHANGE.UPBIT, market: MARKET.SPOT_BTC, marketType: MARKET_TYPE.SPOT, marketCurrency: MARKET_CURRENCY.BTC }},
            { value: MARKET.SPOT_USDT,  label: "USDT 마켓", marketInfo: {exchange: EXCHANGE.UPBIT, market: MARKET.SPOT_USDT, marketType: MARKET_TYPE.SPOT, marketCurrency: MARKET_CURRENCY.USDT }},
        ]
    },
    "bithumb": {
        exchange: { value: EXCHANGE.BITHUMB, label: "빗썸" },
        markets: [
            { value: MARKET.SPOT_KRW,  label: "원화 마켓", marketInfo: {exchange: EXCHANGE.BITHUMB, market: MARKET.SPOT_KRW, marketType: MARKET_TYPE.SPOT, marketCurrency: MARKET_CURRENCY.KRW }},
            { value: MARKET.SPOT_BTC,  label: "BTC 마켓", marketInfo: {exchange: EXCHANGE.BITHUMB, market: MARKET.SPOT_BTC, marketType: MARKET_TYPE.SPOT, marketCurrency: MARKET_CURRENCY.BTC }},
            { value: MARKET.SPOT_USDT,  label: "USDT 마켓", marketInfo: {exchange: EXCHANGE.BITHUMB, market: MARKET.SPOT_USDT, marketType: MARKET_TYPE.SPOT, marketCurrency: MARKET_CURRENCY.USDT }},
        ]
    },
    "binance": {
        exchange: { value: EXCHANGE.BINANCE, label: "Binance" },
        markets: [
            { value: MARKET.SPOT_USDT,  label: "USDT 마켓", marketInfo: {exchange: EXCHANGE.BINANCE, market: MARKET.SPOT_USDT, marketType: MARKET_TYPE.SPOT, marketCurrency: MARKET_CURRENCY.USDT }},
            { value: MARKET.SPOT_BUSD,  label: "BUSD 마켓", marketInfo: {exchange: EXCHANGE.BINANCE, market: MARKET.SPOT_BUSD, marketType: MARKET_TYPE.SPOT, marketCurrency: MARKET_CURRENCY.BUSD }},
            { value: MARKET.SPOT_TUSD,  label: "TUSD 마켓", marketInfo: {exchange: EXCHANGE.BINANCE, market: MARKET.SPOT_TUSD, marketType: MARKET_TYPE.SPOT, marketCurrency: MARKET_CURRENCY.TUSD }},
            { value: MARKET.SPOT_USDC,  label: "USDC 마켓", marketInfo: {exchange: EXCHANGE.BINANCE, market: MARKET.SPOT_USDC, marketType: MARKET_TYPE.SPOT, marketCurrency: MARKET_CURRENCY.USDC }},
            { value: MARKET.USD_M_FUTURE_PERF_USDT,  label: "USDⓈ-M USDT 마켓", marketInfo: {exchange: EXCHANGE.BINANCE, market: MARKET.USD_M_FUTURE_PERF_USDT, marketType: MARKET_TYPE.USD_M_FUTURE_PERF, marketCurrency: MARKET_CURRENCY.USDT }},
            { value: MARKET.USD_M_FUTURE_PERF_BUSD,  label: "USDⓈ-M BUSD 마켓", marketInfo: {exchange: EXCHANGE.BINANCE, market: MARKET.USD_M_FUTURE_PERF_BUSD, marketType: MARKET_TYPE.USD_M_FUTURE_PERF, marketCurrency: MARKET_CURRENCY.BUSD }},
            { value: MARKET.COIN_M_FUTURE_PERF_USD,  label: "COIN-M USD 마켓", marketInfo: {exchange: EXCHANGE.BINANCE, market: MARKET.COIN_M_FUTURE_PERF_USD, marketType: MARKET_TYPE.COIN_M_FUTURE_PERF, marketCurrency: MARKET_CURRENCY.USD }},
        ]
    },
    "bybit": {
        exchange: { value: EXCHANGE.BYBIT, label: "ByBit" },
        markets: [
            { value: MARKET.SPOT_USDT,  label: "USDT 마켓", marketInfo: {exchange: EXCHANGE.BYBIT, market: MARKET.SPOT_USDT, marketType: MARKET_TYPE.SPOT, marketCurrency: MARKET_CURRENCY.USDT}},
        ]
    },
}