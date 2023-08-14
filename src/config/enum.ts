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
    KRW = "KRW",
    USD = "USD",
    USDT = "USDT",    
    USDC = "USDC",
    TUSD = "TUSD",
    BUSD = "BUSD",    
    USDT_PERP = "USDT_PERP",
    USD_PERP = "USD_PERP",
    BTC = "BTC",
    ETH = "ETH",
    BNB = "BNB",
}

export enum WS_TYPE {
    UPBIT_TICKER = "UPBIT_TICKER",
    UPBIT_TRADE = "UPBIT_TRADE",
    UPBIT_ORDER_BOOK = "UPBIT_ORDER_BOOK",
    BINANCE_TICKER = "BINANCE_TICKER",
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
