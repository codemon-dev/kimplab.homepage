import { ASK_BID, EXCHANGE, MARKET, MARKET_CURRENCY, MARKET_TYPE } from "@/config/enum";
import { IAggTradeInfo, IMarketInfo } from "@/config/interface";

export const calculatePrimium = (price1: number, price2: number, currency?: number) => {
    if (price1 === 0 || price2 === 0 || (currency && currency === 0)) {
        return 0
    }
    return wrapNumber((price1 / (price2 * (currency? currency: 1)) - 1) * 100);
}

export const calculateTether = (primium: number, currency: number) => {
    if (primium === 0 || currency === 0) {
        return 0
    }
    return wrapNumber((1.0 + (primium / 100.0)) * currency);
}

export const wrapNumber = (num: number, precision?: number): number => {
    if (!num) {
      return 0
    }
    return Number(num.toFixed(precision ?? 8))
}

export const getEmptyAggTradeInfo = (exchange?: EXCHANGE) => {
    const marketInfo: IMarketInfo = {
        exchange: exchange ?? EXCHANGE.NONE,
        market: MARKET.NONE,
        marketType: MARKET_TYPE.NONE,
        marketCurrency: MARKET_CURRENCY.NONE,
    }
    const aggTradeInfo: IAggTradeInfo = {
        exchange: exchange ?? EXCHANGE.NONE,
        marketInfo: marketInfo,
        symbol: "",
        coinPair: "",
        price: 0,
        accVolume: undefined,          // UTC0기준 누적 거래량
        accVolume_24h: undefined,      // 24H 누적 거래량
        accTradePrice: undefined,      // UTC0기준 누적 거래금액
        accTradePrice_24h: undefined,  // 24H 누적 거래금액
        preClosingPrice: 0,    // 전일 종가
        askBid: ASK_BID.NONE,
        bestBidPrice: 0,
        bestBidQty: 0,
        bestAskPrice: 0,
        bestAskQty: 0,
        change: 0,             // 전일 대비 가격 증감
        change_24h: 0,         // 24H 대비 가격 증감
        changeRate: 0,         // 전일 대비 변동폭
        changeRate_24h: 0,     // 24H 변동폭
        high: 0,
        high_24h: 0,
        low: 0,
        low_24h: 0,
        timestamp: 0,
    }
    return aggTradeInfo;
}