/** @type {import('next').NextConfig} */

/** @type {import('next').NextConfig} */

const rewrites = async () => {
    return [
        {
            source: "/coindex_all_coins",
            destination: "https://coincodex.com/apps/coincodex/cache/all_coins.json"
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


// const rewrites = async () => {
//     return [
//         {
//             source: "/v1/market/all",
//             destination: "https://api.upbit.com/"
//         }
//     ]
// }