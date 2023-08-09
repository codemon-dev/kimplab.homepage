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
    BUSD = "BUSD",
    USDT_PERP = "USDT_PERP",
    BUSD_PERP = "BUSD_PERP",
    BTC = "BTC",
    ETH = "ETH",
    BNB = "BNB",
}

export enum WS_TYPE {
    UPBIT_TICKER = "UPBIT_TICKER",
    UPBIT_TRADE = "UPBIT_TRADE",
    UPBIT_ORDER_BOOK = "UPBIT_ORDER_BOOK",
}

export enum ASK_BID {
    ASK = 0,    // 매도
    BID = 1,    // 매수
}

export enum IMG_TYPE {
    NONE,
    SYMBOL,
    EXCHANGE,
    ETC,
} 
