/** @type {import('next').NextConfig} */

/** @type {import('next').NextConfig} */

const rewrites = async () => {
    return [
        {
            source: "/upbit_market_all",
            destination: "https://api.upbit.com/v1/market/all?isDetails=true",
        },
        {
            source: "/coindex_all_coins",
            destination: "https://coincodex.com/apps/coincodex/cache/all_coins.json"
        },
        {
            source: "/binance_exchangeinfo",
            destination: "https://api.binance.com/api/v3/exchangeInfo"
        },
        {
            source: "/coingecko_exchange_tickers",
            destination: "https://api.coingecko.com/api/v3/exchanges/upbit/tickers"
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