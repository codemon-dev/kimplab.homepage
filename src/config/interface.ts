import { ASK_BID, CURRENCY_SITE_TYPE, EXCHANGE, IMG_TYPE, MARKET, MARKET_CURRENCY, MARKET_TYPE } from "./enum";

export interface IExchangeCoinInfo {
    id?: number,
    exchange: EXCHANGE,
    symbol: string,
    coinPair: string,
    market: MARKET,
    network?: string, // string[] parse해야 함.
    name_kor?: string,
    name_eng?: string,
    warning?: boolean,
    trading?: boolean,
    deposit?: boolean,
    withdraw?: boolean,
    numOfDepositConfirm?: number,
    numOfWithdrawConfirm?: number,
    limitTradingFee?: number,
    marketTradingFee?: number,
    depositFee?: number,
    withdrawFee?: number,
}

export interface IAggTradeInfo {
    exchange: EXCHANGE,
    marketInfo: IMarketInfo,
    symbol: string,
    coinPair: string,
    price: number,
    accVolume: number | undefined,          // UTC0기준 누적 거래량
    accVolume_24h: number | undefined,      // 24H 누적 거래량
    accTradePrice: number | undefined,      // UTC0기준 누적 거래금액
    accTradePrice_24h: number | undefined,  // 24H 누적 거래금액
    preClosingPrice: number,    // 전일 종가
    askBid: ASK_BID,
    bestBidPrice?: number,
    bestBidQty?: number,
    bestAskPrice?: number,
    bestAskQty?: number,
    change?: number,             // 전일 대비 가격 증감
    change_24h?: number,         // 24H 대비 가격 증감
    changeRate?: number,         // 전일 대비 변동폭
    changeRate_24h?: number,     // 24H 변동폭
    high?: number,
    high_24h?: number,
    low?: number,
    low_24h?: number,
    timestamp: number
}

export interface IFundingFeeInfo {
    exchange: EXCHANGE,
    marketInfo: IMarketInfo,
    symbol: string,
    coinPair: string,
    fundingRate: number,
    nextTimestamp: number,
    timestamp: number,
}

export interface PriceQty {
    price: number,
    qty: number
}

export interface IOrderBook {
    exchange: EXCHANGE,
    marketInfo: IMarketInfo,
    symbol: string,
    coinPair: string,
    bid: PriceQty[],
    ask: PriceQty[],
    timestamp: number
}

export interface IImgInfo {
    imgType: IMG_TYPE,
    id: string,
    path: string,
}

export interface IFilterModel {
    symbol: {
        filterType: string;     //"text",
        operator: string;       // "OR",
        condition1?: IFilterCondition | undefined;
        condition2?: IFilterCondition | undefined;
        conditions: IFilterCondition[];
    }
}

export interface IFilterCondition {
    filterType: string;
    type: string;
    filter: string;
}

export interface IMenuOption {
    value: string,
    title?: any, 
    label?: any,
    key?: any,
    selectable?: boolean,
    disabled?: boolean,    
    children?: IMenuOption[]
    marketInfo?: IMarketInfo,
  }

export interface IMarketInfo {
    exchange: EXCHANGE,
    market: MARKET,
    marketType: MARKET_TYPE,
    marketCurrency: MARKET_CURRENCY,
}

export interface ISelectedExchangeMarket {
    exchange: EXCHANGE,
    marketInfo: IMarketInfo,
    menuItem?: IMenuOption,
}

export interface ICurrencyInfos {
    [key: string]: ICurrencyInfo
}
  
export interface ICurrencyInfo {
    type: CURRENCY_SITE_TYPE,
    price: number,
    avgPrice?: number,
    timestamp?: number,  //1684512177277;
}

export type ICurrencyDunamuResponse = {
    code: string; //'FRX.KRWUSD';
    currencyCode: string | null; //'USD';
    currencyName: string | null; //'달러';
    country: string | null; //'미국';
    name: string | null; //'미국 (USD/KRW)';
    date: string; //'2023-05-19';
    time: string; //'23:58:00';
    recurrenceCount: number | null; //537;
    basePrice: number; //1327.5;
    openingPrice: number | null; //1332.7;
    highPrice: number | null; //1336.0;
    lowPrice: number | null; //1326.0;
    change: string | null; //'FALL';
    changePrice: number | null; //9.5;
    cashBuyingPrice: number | null; //1350.73;
    cashSellingPrice: number | null; //1304.27;
    ttBuyingPrice: number | null; //1314.5;
    ttSellingPrice: number | null; //1340.5;
    tcBuyingPrice: number | null; // null
    fcSellingPrice: number | null;  //null
    exchangeCommission: number | null; //6.9321;
    usDollarRate: number | null; //1.0;
    high52wPrice: number | null; //1445.0;
    high52wDate: string | null; //'2022-10-13';
    low52wPrice: number | null; //1216.6;
    low52wDate: string | null; //'2023-02-02';
    currencyUnit: number | null; //1;
    provider: string | null; //'하나은행';
    timestamp: number; //1684512177277;
    id: number | null; //79;
    modifiedAt: string | null; //'2023-05-19T16:02:57.000+0000';
    createdAt: string | null; //'2016-10-21T06:13:34.000+0000';
    signedChangePrice: number | null; //-9.5;
    signedChangeRate: number | null; //-0.00710546;
    changeRate: number | null; //0.00710546;
};


export interface ICurrencyInvestringResponse {
    timestamp: number;
    price: number;
    price_open: number;
    price_high: number;
    price_low: number;
    price_close: number;
}


export interface ICurrencyYahooResponse {
    meta: {
        regularMarketTime: number,
        regularMarketPrice: number,
    };
    timestamp: number[],
    indicators: {
        quote: {
        high: number[],
        volume: number[],
        open: number[],
        close: number[],
        low: number[],
        }[]
    }
}

export interface ICurrencyWeebullResponse {
    close: string;
    tradeTime: string;
    timeZone: string;
}


export interface ILongShortRatio
{ 
    symbol: string;
    coinPair: string;
    marketInfo: IMarketInfo;
    long: number;
    short: number;
    timestamp: number;
}