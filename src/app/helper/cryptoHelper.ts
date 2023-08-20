import { ExchangeDefaultInfo } from "@/config/constants";
import { EXCHANGE, MARKET, MARKET_CURRENCY, MARKET_TYPE } from "@/config/enum";
import { IMarketInfo } from "@/config/interface";

export const parseCoinInfoFromCoinPair = (exchnage: EXCHANGE, marketType: MARKET_TYPE, coinPair: string) => {
    let symbol: string = "";
    let market: string = "";
    let marketCurrency: string = "";
    if (exchnage === EXCHANGE.UPBIT) {
        symbol = coinPair.split('-')[1]
        marketCurrency = coinPair.split('-')[0]
        if (marketCurrency === MARKET_CURRENCY.KRW) {
            market = MARKET.SPOT_KRW;
        } else if (marketCurrency === MARKET_CURRENCY.BTC) {
            market = MARKET.SPOT_BTC;
        } else if (marketCurrency === MARKET_CURRENCY.USDT) {
            market = MARKET.SPOT_USDT;
        }
        
    } else if (exchnage === EXCHANGE.BINANCE) {
        if (marketType === MARKET_TYPE.SPOT) {
            for (const marketItem of ExchangeDefaultInfo.binance.markets) {
                if (marketType !== marketItem.marketInfo.marketType) continue;
                if (coinPair.endsWith(marketItem.marketInfo.marketCurrency) === true) {
                    symbol = coinPair.split(marketItem.marketInfo.marketCurrency)[0];
                    market = marketItem.marketInfo.market;
                    marketCurrency = marketItem.marketInfo.marketCurrency;
                    break;
                }
            }
        } else if (marketType === MARKET_TYPE.USD_M_FUTURE_PERF) {
            if (coinPair.endsWith('USDT') === true) {
                symbol = coinPair.split('USDT')[0]
                market = MARKET.USD_M_FUTURE_PERF_USDT;
                marketCurrency = MARKET_CURRENCY.USDT;
            } else if (coinPair.endsWith('BUSD') === true) {
                symbol = coinPair.split('BUSD')[0]
                market = MARKET.USD_M_FUTURE_PERF_BUSD;
                marketCurrency = MARKET_CURRENCY.BUSD;
            }
        } else if (marketType === MARKET_TYPE.COIN_M_FUTURE_PERF) {
            if (coinPair.endsWith('USD_PERP') === true) {
                symbol = coinPair.split('USD_PERP')[0]
                market = MARKET.COIN_M_FUTURE_PERF_USD;
                marketCurrency = MARKET_CURRENCY.USD;
                coinPair = coinPair.split('_PERP')[0]
            }
        }
    }
    return ({symbol, coinPair, market, marketCurrency});
}

export const getMarketInfo = (exchange: EXCHANGE, market: MARKET) => {
    let marketType: MARKET_TYPE = MARKET_TYPE.NONE;
    let marketCurrency: MARKET_CURRENCY = MARKET_CURRENCY.NONE;

    if (market.startsWith(MARKET_TYPE.SPOT) === true) {
        marketType = MARKET_TYPE.SPOT;
    } else if (market.startsWith(MARKET_TYPE.USD_M_FUTURE_PERF) === true) {
        marketType = MARKET_TYPE.USD_M_FUTURE_PERF;
    } else if (market.startsWith(MARKET_TYPE.COIN_M_FUTURE_PERF) === true) {
        marketType = MARKET_TYPE.COIN_M_FUTURE_PERF;
    }

    marketCurrency = market.split(`${marketType}_`)[1] as MARKET_CURRENCY

    if (market.startsWith(MARKET_TYPE.SPOT) === true) {
        marketType = MARKET_TYPE.SPOT;
    } else if (market.startsWith(MARKET_TYPE.USD_M_FUTURE_PERF) === true) {
        marketType = MARKET_TYPE.USD_M_FUTURE_PERF;
    } else if (market.startsWith(MARKET_TYPE.COIN_M_FUTURE_PERF) === true) {
        marketType = MARKET_TYPE.COIN_M_FUTURE_PERF;
    }
    const marketInfo: IMarketInfo = {
        exchange: exchange,
        market: market,
        marketType,
        marketCurrency
    }
    return marketInfo;
}

export const removeTrailingZeros = (number: number, numOfFixed?: number) => {
    if (number === undefined || number === null) {
        return "";
    }
    // Convert the number to a string representation with 10 decimal places
    const stringWithFixedDecimal = number.toFixed(numOfFixed? numOfFixed: 10);
  
    // Use parseFloat to remove trailing zeros
    const parsedNumber = parseFloat(stringWithFixedDecimal);
  
    // Use toLocaleString to convert back to a string with standard decimal format
    const formattedNumber = parsedNumber.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 10
    });
  
    // Return the result
    return formattedNumber;
  }