import { EXCHANGE } from "@/config/enum";

export const parseCoinInfoFromCoinPair = (exchnage:EXCHANGE, coinPair: string) => {
    let symbol: string = "";
    let market: string = "";
    if (exchnage === EXCHANGE.UPBIT) {
        symbol = coinPair.split('-')[1]
        market = coinPair.split('-')[0]
    }
    return ({symbol, coinPair, market});
}

export const removeTrailingZeros = (number: number) => {
    if (number === undefined || number === null) {
        return -1;
    }
    // Convert the number to a string representation with 10 decimal places
    const stringWithFixedDecimal = number.toFixed(10);
  
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