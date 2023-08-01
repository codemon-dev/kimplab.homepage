export enum FETCH_METHOD {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
}

export enum EXCHANGE {
    NONE = "none",
    UPBIT = "upbit",
    BITHUM = "bithum",
    BINANCE = "binance",
    BYBIT = "bybit",
    OKX = "okx",
    KUCOIN = "kucoin",
    HUOBI = "huobi",
    GATEIO = "gateio",
    MEXC = "mexc"
}

export enum MARKET {
    NONE = "none",
    KRW = "krw",
    USD = "usd",
    USDT = "usdt",    
    BUSD = "busd",
    USDT_PERP = "usdt_perp",
    BUSD_PERP = "busd_perp",
    BTC = "btc",
    ETH = "eth",
    BNB = "bnb",
}

export enum WS_TYPE {
    UPBIT_TRADE = "UPBIT_TRADE",
    UPBIT_ORDER_BOOK = "UPBIT_ORDER_BOOK",
}

export enum ASK_BID {
    ASK = 0,    // 매도
    BID = 1,    // 매수
}

export enum IMG_TYPE {
    SYMBOL = 0,
    EXCHANGE = 1,
    ETC = 2,
    NONE = 4
} 
