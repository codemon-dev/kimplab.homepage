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
    BINANCE_USD_M_FUTURE_MARKET_PRICE = "BINANCE_USD_M_FUTURE_MARKET_PRICE",
    BINANCE_COIN_M_FUTURE_TICKER = "BINANCE_COIN_M_FUTURE_TICKER",
    BINANCE_COIN_M_FUTURE_ORDER_BOOK = "BINANCE_COIN_M_FUTURE_ORDER_BOOK",
    BINANCE_COIN_M_FUTURE_MARKET_PRICE = "BINANCE_COIN_M_FUTURE_MARKET_PRICE",
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

export enum EXCHANGE_RATE_URL {
    DUNAMU = 'http://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD',
    INVESTRING = 'https://api.investing.com/api/financialdata/650/historical/chart/?period=P1W&interval=PT1M&pointscount=60',

    // 실시간
    // YAHOO = 'https://query1.finance.yahoo.com/v8/finance/chart/KRW=X?region=US&lang=en-US&includePrePost=false&interval=1d&useYfid=false&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance'
    // 1분단위
    YAHOO = 'https://query1.finance.yahoo.com/v8/finance/chart/KRW=X?region=US&lang=en-US&includePrePost=false&interval=1m&useYfid=false&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance',
    WEBULL = 'https://quotes-gw.webullfintech.com/api/stock/tickerRealTime/getQuote?tickerId=913344371&includeSecu=1&includeQuote=1&more=1',
}

export enum REWRITE_ENDPOINT {
    CURRENCY_DUNAMU = "/currency_dunamu",
    CURRENCY_INVESTING = "/currency_investing",
    CURRENCY_YAHOO = "/currency_yahoo",
    CURRENCY_WEEBULL = "/currency_weebull",
}

export enum CURRENCY_SITE_TYPE {
    NONE= "NONE",
    DUNAMU='DUNAMU',
    INVESTRING="INVESTRING",
    YAHOO = 'YAHOO',
    WEBULL = 'WEBULL',
}
