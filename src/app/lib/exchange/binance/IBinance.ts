
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
    API_EXCHANGEINFO = "/binance_exchangeinfo",
    API_TICKER = "/binance_ticker",
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
    x: string; // "0.0009",      // First trade(F)-1 price (first trade before the 24hr rolling window)
    c: string; // "0.0025",      // Last price
    Q: string; // "10",          // Last quantity
    b: string; // "0.0024",      // Best bid price
    B: string; // "10",          // Best bid quantity
    a: string; // "0.0026",      // Best ask price
    A: string; // "100",         // Best ask quantity
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

export interface IBinanceTickerResponse {
    symbol: string; //"BNBBTC",
    priceChange: string; //"-8.00000000",  // Absolute price change
    priceChangePercent: string; //"-88.889",      // Relative price change in percent
    weightedAvgPrice: string; //"2.60427807",   // QuoteVolume / Volume
    openPrice: string; //"9.00000000",
    highPrice: string; //"9.00000000",
    lowPrice: string; //"1.00000000",
    lastPrice: string; //"1.00000000",
    volume: string; //"187.00000000",
    quoteVolume: string; //"487.00000000", // Sum of (price * volume) for all trades
    openTime: number; //1641859200000,  // Open time for ticker window
    closeTime: number; //1642031999999,  // Current Time of the Request
    firstId: number; //0,              // Trade IDs
    lastId: number; //60,
    count: number; //61              // Number of trades in the interval
}

export interface BinanceSocketPayload {
    id: number
    method: string
    params?: any
}