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
    volume: number,
    askBid: ASK_BID,    
    change: number,             // 전일 대비 가격 증감
    preClosingPrice: number,    // 전일 종가
    changeRate: number,         // 변동폭
    timestamp: number
}

export interface IImgInfo {
    imgType: IMG_TYPE,
    id: string,
    path: string,
  }