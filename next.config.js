/** @type {import('next').NextConfig} */

const rewrites = async () => {
    return [
        {
            source: "/coindex_all_coins",
            destination: "https://coincodex.com/apps/coincodex/cache/all_coins.json"
        },
        {
            source: "/coindex_get_coin_charts/:path*",
            destination: "https://coincodex.com/api/coincheckup/get_coin_charts/:path*"
        },
        {
            source: "/coingecko_exchange_tickers",
            destination: "https://api.coingecko.com/api/v3/exchanges/upbit/tickers"
        },
        {
            source: "/upbit_market_all",
            destination: "https://api.upbit.com/v1/market/all?isDetails=true",
        },
        {
            source: "/upbit_marketcap",
            destination: "https://crix-api-cdn.upbit.com/v1/crix/marketcap?currency=KRW",
        },        
        {
            source: "/binance_spot_exchangeinfo",
            destination: "https://api.binance.com/api/v3/exchangeInfo"
        },
        {
            source: "/binance_usd_m_future_exchangeinfo",
            destination: "https://fapi.binance.com/fapi/v1/exchangeInfo"
        },
        {
            source: "/binance_coin_m_future_exchangeinfo",
            destination: "https://dapi.binance.com/dapi/v1/exchangeInfo"
        },
        {
            source: "/binance_spot_ticker",
            destination: "https://api.binance.com/api/v3/ticker/24hr"
        },
        {
            source: "/binance_usd_m_future_ticker",
            destination: "https://fapi.binance.com/fapi/v1/ticker/24hr"
        },
        {
            source: "/binance_coin_m_future_ticker",
            destination: "https://dapi.binance.com/dapi/v1/ticker/24hr"
        },
        {
            source: "/binance_usd_m_future_book_ticker",
            destination: "https://fapi.binance.com/fapi/v1/ticker/bookTicker"
        },
        {
            source: "/binance_coin_m_future_book_ticker",
            destination: "https://dapi.binance.com/dapi/v1/ticker/bookTicker"
        },
        {
            source: "/binance_usd_m_future_market_price",
            destination: "https://fapi.binance.com/fapi/v1/premiumIndex"
        },
        {
            source: "/binance_coin_m_future_market_price",
            destination: "https://dapi.binance.com/dapi/v1/premiumIndex"
        },
        {
            source: "/binance_coin_m_future_global_long_short_ratio/:path*",
            destination: 'https://fapi.binance.com/futures/data/globalLongShortAccountRatio/:path*'
        },
        {
            source: "/currency_dunamu",
            destination: 'http://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD'
        },
        {
            source: "/currency_investing",
            destination: 'https://api.investing.com/api/financialdata/650/historical/chart/?period=P1W&interval=PT1M&pointscount=60'
        },
        {
            source: "/currency_yahoo",
            destination: 'https://query1.finance.yahoo.com/v8/finance/chart/KRW=X?region=US&lang=en-US&includePrePost=false&interval=1m&useYfid=false&range=1d&corsDomain=finance.yahoo.com&.tsrc=finance'
        },
        {
            source: "/currency_weebull",
            destination: 'https://quotes-gw.webullfintech.com/api/stock/tickerRealTime/getQuote?tickerId=913344371&includeSecu=1&includeQuote=1&more=1'
        }
    ];
};

const nextConfig = {
    reactStrictMode: false,
    rewrites,
    // eslint: {
    //   ignoreDuringBuilds: true,
    //   ignoreBuildErrors: true,
    // },
}

module.exports = nextConfig
