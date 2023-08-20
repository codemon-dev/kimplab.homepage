import { ASK_BID, EXCHANGE, IMG_TYPE, MARKET, MARKET_CURRENCY, MARKET_TYPE } from "./enum";

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