export enum FETCH_METHOD {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
}

export enum EXCHANGE {
    NONE = "NONE",
    UPBIT = "UPBIT",
    BITHUMB = "BITHUMB",
    BINANCE = "BINANCE",
    BYBIT = "BYBIT",
    OKX = "OKX",
    KUCOIN = "KUCOIN",
    HUOBI = "HUOBI",
    GATEIO = "GATEIO",
    MEXC = "MEXC"
}

export enum MARKET {
    NONE = "NONE",
    SPOT_KRW = "SPOT_KRW",
    SPOT_BTC = "SPOT_BTC",
    SPOT_ETH = "SPOT_ETH",
    SPOT_BNB = "SPOT_BNB",
    SPOT_USD = "SPOT_USD",
    SPOT_USDT = "SPOT_USDT",
    SPOT_BUSD = "SPOT_BUSD",
    SPOT_USDC = "SPOT_USDC",
    SPOT_TUSD = "SPOT_TUSD",
    USD_M_FUTURE_PERF_USDT = "USD_M_FUTURE_PERF_USDT",
    USD_M_FUTURE_PERF_BUSD = "USD_M_FUTURE_PERRF_BUSD",
    COIN_M_FUTURE_PERF_USD = "COIN_M_FUTURE_PERF_USD",
}

export enum MARKET_CURRENCY {
    NONE = "NONE",
    KRW = "KRW",
    BTC = "BTC",
    ETH = "ETH",
    BNB = "BNB",
    USD = "USD",
    USDT = "USDT",
    BUSD = "BUSD",
    USDC = "USDC",
    TUSD = "TUSD",
}

export enum MARKET_TYPE {
    NONE = "NONE",
    SPOT = "SPOT",
    USD_M_FUTURE_PERF = "USD_M_FUTURE_PERF",
    COIN_M_FUTURE_PERF = "COIN_M_FUTURE_PERF",
}

export enum WS_TYPE {
    UPBIT_TICKER = "UPBIT_TICKER",
    UPBIT_TRADE = "UPBIT_TRADE",
    UPBIT_ORDER_BOOK = "UPBIT_ORDER_BOOK",
    BINANCE_SPOT_TICKER = "BINANCE_SPOT_TICKER",
    BINANCE_USD_M_FUTURE_TICKER = "BINANCE_USD_M_FUTURE_TICKER",
    BINANCE_USD_M_FUTURE_ORDER_BOOK = "BINANCE_USD_M_FUTURE_ORDER_BOOK",
    BINANCE_COIN_M_FUTURE_TICKER = "BINANCE_COIN_M_FUTURE_TICKER",
    BINANCE_COIN_M_FUTURE_ORDER_BOOK = "BINANCE_COIN_M_FUTURE_ORDER_BOOK",
}

export enum ASK_BID {
    NONE,
    ASK,    // 매도
    BID,    // 매수
}

export enum IMG_TYPE {
    NONE,
    SYMBOL,
    EXCHANGE,
    ETC,
} 
