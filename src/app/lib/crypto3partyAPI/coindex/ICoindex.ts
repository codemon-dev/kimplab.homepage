
// export const COINDEX_API_URL = PROXY_ANYWHERE_URL + "https://coincodex.com/apps/coincodex/"
//export const COINDEX_API_URL = "https://coincodex.com/apps/coincodex/"
export enum COINDEX_ENDPOINT {
  //API_MARKET_ALL = "https://coincodex.com/apps/coincodex/cache/all_coins.json"
  API_ALL_COINS = "/coindex_all_coins"
}

export interface ICoinDexAllCoins {
  symbol: string, //"BTC",
  display_symbol: string, //"BTC",
  name: string, //"Bitcoin",
  aliases: string, //"",
  shortname: string, //"bitcoin",
  last_price_usd: number, //28917,
  market_cap_rank: number, //1,
  volume_rank: number, //2,
  price_change_1H_percent: number, //-0.03,
  price_change_1D_percent: number, //-1.61,
  price_change_7D_percent: number, //-0.97,
  price_change_30D_percent: number, //-5.26,
  price_change_90D_percent: number, //0.92,
  price_change_180D_percent: number, //21.57,
  price_change_365D_percent: number, //23.96,
  price_change_3Y_percent: number, //148,
  price_change_5Y_percent: number, //278,
  price_change_ALL_percent: number, //57834800,
  price_change_YTD_percent: number, //74.74,
  volume_24_usd: number, //38211428352,
  display: string, //"true",
  trading_since: string, //"2010-07-17 00:00:00",
  supply: number, //19442812,
  last_update: string, //"1690887725",
  ico_end: null,
  include_supply: string, //"true",
  use_volume: string, //"true",
  growth_all_time: string, //"70.7946",
  ccu_slug: string, //"bitcoin",
  image_id: string, //"b9469e27-476b-4fc8-0d5e-9a9e51581400",
  image_t: number, //1654242883,
  market_cap_usd: number, //562236932726,
  categories: number[]  //[1,39]
}

export interface ICoinDexAllCoinsImgPath {
  symbol: string,
  imgId: string,
}