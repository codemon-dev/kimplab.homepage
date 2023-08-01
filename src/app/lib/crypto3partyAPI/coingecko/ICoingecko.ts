export enum COINGECKO_ENDPOINT {
  API_ALL_COINS = "/coingecko_exchange_tickers"
}

export interface ICoinGeckoExhcnageTicker {
    name: string, //"Upbit",
    tickers: [{
        base: string, // "RFR",
        target: string, // "KRW",
        market: {
          name: string, // "Upbit",
          identifier: string, // "upbit",
          has_trading_incentive: boolean, // false
        },
        last: number, // 24.6,
        volume: number, // 7695034821.257939,
        converted_last: {
          btc: number, // 6.58773e-07,
          eth: number, // 1.035e-05,
          usd: number, // 0.01926437
        },
        converted_volume: {
          btc: number, // 5069,
          eth: number, // 79677,
          usd: number, // 148240015
        },
        trust_score: string, // "green",
        bid_ask_spread_percentage: number, // 0.406504,
        timestamp: string, // "2023-07-31T16:52:41+00:00",
        last_traded_at: string, // "2023-07-31T16:52:41+00:00",
        ast_fetch_at: string, // "2023-07-31T16:52:41+00:00",
        is_anomaly: boolean, // false,
        is_stale: boolean, // false,
        trade_url: string, // "https://upbit.com/exchange?code=CRIX.UPBIT.KRW-RFR",
        token_info_url: string | null   //null,
        coin_id: string, // "refereum"
    }]
}