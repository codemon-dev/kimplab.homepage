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