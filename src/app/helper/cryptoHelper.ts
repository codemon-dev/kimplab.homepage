import { ExchangeDefaultInfo } from "@/config/constants";
import { EXCHANGE, MARKET } from "@/config/enum";

export const parseCoinInfoFromCoinPair = (exchnage:EXCHANGE, coinPair: string, isFutures: boolean = false) => {
    let symbol: string = "";
    let market: string = "";
    if (exchnage === EXCHANGE.UPBIT) {
        symbol = coinPair.split('-')[1]
        market = coinPair.split('-')[0]
    } else if (exchnage === EXCHANGE.BINANCE) {
        if (isFutures === true) {
            if (coinPair.endsWith('USDT') === true) {
                symbol = coinPair.split('USDT')[0]
                market = MARKET.USDT_PERP
            } else if (coinPair.endsWith('USD') === true) {
                symbol = coinPair.split('USD')[0]
                market = MARKET.USD_PERP
            }
        } else {
            for (const marketItem of ExchangeDefaultInfo.binance.markets) {
                if (coinPair.endsWith(marketItem) === true) {
                    symbol = coinPair.split(marketItem)[0];
                    market = marketItem;
                    break;
                }
            }
        }
        
    }
    return ({symbol, coinPair, market});
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