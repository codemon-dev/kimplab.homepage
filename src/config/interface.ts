import { ASK_BID, EXCHANGE, IMG_TYPE, MARKET } from "./enum";

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
    market: MARKET,
    symbol: string,
    coinPair: string,
    price: number,
    accVolume: number,          // UTC0기준 누적 거래량
    accVolume_24h: number,      // 24H 누적 거래량
    accTradePrice: number,      // UTC0기준 누적 거래금액
    accTradePrice_24h: number,  // 24H 누적 거래금액
    preClosingPrice: number,    // 전일 종가
    askBid: ASK_BID,    
    change?: number,             // 전일 대비 가격 증감
    change_24h?: number,         // 24H 대비 가격 증감
    changeRate?: number,         // 전일 대비 변동폭
    changeRate_24h?: number,     // 24H 변동폭
    timestamp: number
}

export interface IImgInfo {
    imgType: IMG_TYPE,
    id: string,
    path: string,
  }