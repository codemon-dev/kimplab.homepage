
export interface IBinancePriceAmount {
    price: string,
    amount: string,
}

export interface IBestBidAsk {
    coinPair: string;
    receivedAt: number;
    bestBid: string;
    bestAsk: string;
    bestBidQty: string;
    bestAskQty: string;    
}

export interface IBinanceDeepth {
    coinPair: string;
    timestamp: number;
    receivedAt: number;
    bid: IBinancePriceAmount[];
    ask: IBinancePriceAmount[];    
}

export interface IBinanceAggTrade {
    coinPair: string;
    timestamp: number,
    receivedAt: number;
    isMaker: boolean,
    price: string,
    amount: string,
}
export interface IBinanceCoinInfos {
    [key: string]: IBinanceCoinInfo
}

export interface IBinanceCoinInfo {
    coinPair: string;
    deepth: IBinanceDeepth;
    bestBidAsk: IBestBidAsk;
    aggregateTrade: IBinanceAggTrade;
}


export interface IBinanceAccount {
    feeTier: number;    //0,
    canTrade: boolean;  //true,
    canDeposit: boolean;    //true,
    canWithdraw: boolean;   //true,
    updateTime: number;    //0,
    multiAssetsMargin: boolean;     //false,
    totalInitialMargin: string; //'0.00000000',
    totalMaintMargin: string;   //'0.00000000',
    totalWalletBalance: string; //'0.00000000',
    totalUnrealizedProfit: string;  //'0.00000000',
    totalMarginBalance: string; //'0.00000000',
    totalPositionInitialMargin: string; //'0.00000000',
    totalOpenOrderInitialMargin: string;    //'0.00000000',
    totalCrossWalletBalance: string;    //'0.00000000',
    totalCrossUnPnl: string;    //'0.00000000',
    availableBalance: string;   //'0.00000000',
    maxWithdrawAmount: string;  //'0.00000000'
    assets: {
        asset: string;  //'BTC'
        walletBalance: string;  //'0.00000000',
        unrealizedProfit: string;   //'0.00000000',
        marginBalance: string;  //'0.00000000',
        maintMargin: string;    //'0.00000000',
        initialMargin: string;  //'0.00000000',
        positionInitialMargin: string;  //'0.00000000',
        openOrderInitialMargin: string; //'0.00000000',
        maxWithdrawAmount: string;  //'0.00000000',
        crossWalletBalance: string; //'0.00000000',
        crossUnPnl: string; //'0.00000000',
        availableBalance: string;   //'0.00000000',
        marginAvailable: boolean;   //true,
        updateTime: number; //0
    }[];
    positions: {
        symbol: string; //'SUSHIUSDT',
        initialMargin: string;  //'0',
        maintMargin: string;    //'0',
        unrealizedProfit: string;   //'0.00000000',
        positionInitialMargin: string;  //'0',
        openOrderInitialMargin: string; //'0',
        leverage: string;   //'20',
        isolated: boolean;  //false,
        entryPrice: string; //'0.0',
        maxNotional: string;    //'25000',
        positionSide: string;   //'BOTH',
        positionAmt: string;    //'0',
        notional: string;   //'0',
        isolatedWallet: string; //'0',
        updateTime: number; //0,
        bidNotional: string;    //'0',
        askNotional: string;    //'0',
    }[]
}


export interface IBinanceOrderResponse {
    orderId: any; //3379672655,
    symbol: string; //'BTCUSDT',
    status: string; //'NEW',
    clientOrderId: string; //'Ugn0iig4p4fIXKEraQSFDB',
    price: string; //'53330.00',
    avgPrice: string; //'0.00',
    origQty: string; //'0.001',
    executedQty: string; //'0.000',
    cumQty: string; //'0.000',
    cumQuote: string; //'0.00000',
    timeInForce: string; //'GTX',
    type: string; //'LIMIT',
    reduceOnly: boolean;    //false,
    closePosition: boolean;    //false,
    side: string; //'SELL',
    positionSide: string; //'SHORT',
    stopPrice: string; //'0.00',
    workingType: string; //'CONTRACT_PRICE',
    priceProtect: boolean;    //false,
    origType: string; //'LIMIT',
    updateTime: number; //1687273928431
}

export enum BINANCE_ENDPOINT {
    API_SPOT_EXCHANGEINFO = "/binance_spot_exchangeinfo",
    API_USD_M_FUTURE_EXCHANGEINFO = "/binance_usd_m_future_exchangeinfo",
    API_COIN_M_FUTURE_EXCHANGEINFO = "/binance_coin_m_future_exchangeinfo",
    API_SPOT_TICKER = "/binance_spot_ticker",
    API_USD_M_FUTURE_TICKER = "/binance_usd_m_future_ticker",
    API_COIN_M_FUTURE_TICKER = "/binance_coin_m_future_ticker",
    API_USD_M_FUTURE_BOOK_TICKER = "/binance_usd_m_future_book_ticker",
    API_COIN_M_FUTURE_BOOK_TICKER = "/binance_coin_m_future_book_ticker",
    API_USD_M_FUTURE_MARKET_PRICE = "/binance_usd_m_future_market_price",
    API_COIN_M_FUTURE_MARKET_PRICE = "/binance_coin_m_future_market_price",
    
  }

export interface IBinanceUserTrade {
    symbol: string; //'BTCUSDT',
    id: any; //262086445,
    orderId: number; //3388726196,
    side: string; //'SELL',
    price: string; //'30155.40',
    qty: string; //'0.100',
    realizedPnl: string; //'0',
    marginAsset: string; //'USDT',
    quoteQty: string; //'3015.54000',
    commission: string; //'1.20621600',
    commissionAsset: string; //'USDT',
    time: number; //1687962305038,
    positionSide: string; //'SHORT',
    maker: boolean; //false,
    buyer: boolean; //false
}

export interface IBinanceWSTickerResponse {
    e: string; // "24hrTicker",  // Event type
    E: number; // 123456789,     // Event time
    s: string; // "BNBBTC",      // Symbol
    p: string; // "0.0015",      // Price change
    P: string; // "250.00",      // Price change percent
    w: string; // "0.0018",      // Weighted average price
    x?: string; // "0.0009",      // First trade(F)-1 price (first trade before the 24hr rolling window)
    c: string; // "0.0025",      // Last price
    Q: string; // "10",          // Last quantity
    b?: string; // "0.0024",      // Best bid price
    B?: string; // "10",          // Best bid quantity
    a?: string; // "0.0026",      // Best ask price
    A?: string; // "100",         // Best ask quantity
    o: string; // "0.0010",      // Open price
    h: string; // "0.0025",      // High price
    l: string; // "0.0010",      // Low price
    v: string; // "10000",       // Total traded base asset volume
    q: string; // "18",          // Total traded quote asset volume
    O: number; // 0,             // Statistics open time
    C: number; // 86400000,      // Statistics close time
    F: number; // 0,             // First trade ID
    L: number; // 18150,         // Last trade Id
    n: number; // 18151          // Total number of trades
}

export interface IBinanceWSMarketPriceResponse {
    e: string;  //"markPriceUpdate",     // Event type
    E: number;  //1562305380000,         // Event time
    s: string;  //"BTCUSDT",             // Symbol
    p: string;  //"11794.15000000",      // Mark price
    i: string;  //"11784.62659091",      // Index price
    P: string;  //"11784.25641265",      // Estimated Settle Price, only useful in the last hour before the settlement starts
    r: string;  //"0.00038167",          // Funding rate
    T: number;  //1562306400000          // Next funding time
  }

export interface IBinanceMarketPriceResponse {
    symbol: string; //"BTCUSDT",
    markPrice: string; //"11793.63104562",  // mark price
    indexPrice: string; //"11781.80495970", // index price
    estimatedSettlePrice: string; //"11781.16138815", // Estimated Settle Price, only useful in the last hour before the settlement starts.
    lastFundingRate: string; //"0.00038246",  // This is the Latest funding rate
    nextFundingTime: number; //1597392000000,
    interestRate: string; //"0.00010000",
    time: number; //1597370495002
}

export interface IBinanceTickerResponse {
    symbol: string; //"BNBBTC",
    priceChange: string; //"-8.00000000",  // Absolute price change
    priceChangePercent: string; //"-88.889",      // Relative price change in percent
    weightedAvgPrice: string; //"2.60427807",   // QuoteVolume / Volume
    prevClosePrice: string // "0.00104300",
    lastPrice: string; //"1.00000000",
    lastQty: string // "324.31000000",
    bidPrice: string // "0.00105400",
    bidQty: string // "394.10000000",
    askPrice: string // "0.00105900",
    askQty: string // "5.09000000",
    openPrice: string; //"9.00000000",
    highPrice: string; //"9.00000000",
    lowPrice: string; //"1.00000000",
    volume: string; //"187.00000000",
    quoteVolume: string; //"487.00000000", // Sum of (price * volume) for all trades
    openTime: number; //1641859200000,  // Open time for ticker window
    closeTime: number; //1642031999999,  // Current Time of the Request
    firstId: number; //0,              // Trade IDs
    lastId: number; //60,
    count: number; //61              // Number of trades in the interval
}

export interface IBinanceBookTickerResponse 
{
    symbol: string; //"BTCUSDT",
    bidPrice: string; //"4.00000000",
    bidQty: string; //"431.00000000",
    askPrice: string; //"4.00000200",
    askQty: string; //"9.00000000",
    time: number; //1589437530011   // Transaction time
}

export interface BinanceSocketPayload {
    id: number
    method: string
    params?: any
}