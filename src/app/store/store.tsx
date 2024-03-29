// GlobalStore.tsx (note the .tsx extension for TypeScript files)
import { createContext } from 'react';
import { ACTIONS } from './actions';
import { IAggTradeInfo, ICurrencyInfo, ICurrencyInfos, IDominanceChartInfo, IExchangeCoinInfo, IImgInfo, IMarketcapInfo, IOrderBook } from '@/config/interface';
import { CURRENCY_SITE_TYPE, EXCHANGE, IMG_TYPE, MARKET } from '@/config/enum';
import _ from 'lodash'

export type GlobalStoreState = {
  symbolImgMap: Map<string, IImgInfo>;
  exchangeImgMap: Map<string, IImgInfo>;
  etcImgMap: Map<string, IImgInfo>;
  exchangeConinInfos: Map<EXCHANGE, Map<string, IExchangeCoinInfo>>;
  upbitTradeWsInfoMap: Map<MARKET, Map<string, IAggTradeInfo>>;
  upbitOrderBookWsInfoMap: Map<MARKET, Map<string, IOrderBook>>;
  bithumbTradeWsInfoMap: Map<MARKET, Map<string, IAggTradeInfo>>;
  bithumbOrderBookWsInfoMap: Map<MARKET, Map<string, IOrderBook>>;
  binanceTradeWsInfoMap: Map<MARKET, Map<string, IAggTradeInfo>>;
  binanceOrderBookWsInfoMap: Map<MARKET, Map<string, IOrderBook>>;
  bybitTradeWsInfoMap: Map<MARKET, Map<string, IAggTradeInfo>>;
  bybitOrderBookWsInfoMap: Map<MARKET, Map<string, IOrderBook>>;
  currencyInfos: Map<CURRENCY_SITE_TYPE, ICurrencyInfo>;
  dominanceInfo: IDominanceChartInfo,
  marketCapInfos: IMarketcapInfo[],
};

type GlobalStoreType = {
  state: GlobalStoreState;
  dispatch: React.Dispatch<Action>;
};

type Action = {
  type: ACTIONS;
  key?: any;
  value?: any; // Optional for ADD_TO_MAP
};

// Define the initial state with the types
export const initialState: GlobalStoreState = {
  symbolImgMap: new Map<string, IImgInfo>(),
  exchangeImgMap: new Map<string, IImgInfo>(),
  etcImgMap: new Map<string, IImgInfo>(),
  exchangeConinInfos: new Map<EXCHANGE, Map<string, IExchangeCoinInfo>>(),
  upbitTradeWsInfoMap: new Map<MARKET, Map<string, IAggTradeInfo>>(),
  upbitOrderBookWsInfoMap: new Map<MARKET, Map<string, IOrderBook>>(),
  bithumbTradeWsInfoMap: new Map<MARKET, Map<string, IAggTradeInfo>>(),
  bithumbOrderBookWsInfoMap: new Map<MARKET, Map<string, IOrderBook>>(),
  binanceTradeWsInfoMap: new Map<MARKET, Map<string, IAggTradeInfo>>(),
  binanceOrderBookWsInfoMap: new Map<MARKET, Map<string, IOrderBook>>(),
  bybitTradeWsInfoMap: new Map<MARKET, Map<string, IAggTradeInfo>>(),
  bybitOrderBookWsInfoMap: new Map<MARKET, Map<string, IOrderBook>>(),
  currencyInfos: new Map<CURRENCY_SITE_TYPE, ICurrencyInfo>(),
  dominanceInfo: {chart: [], curDominance: 0, timestamp: 0},
  marketCapInfos: [],
};

// Create the reducer function with the types
export const reducer = (state: GlobalStoreState, action: Action): GlobalStoreState => {
  switch (action.type) {
    case ACTIONS.UPDATE_CURRENCY_INFO:
      if (!action.value || action.value.length === 0) {
        break;
      }
      state = { ...state, currencyInfos: _.cloneDeep(action.value) }
      break;

    case ACTIONS.UPDATE_DOMINANCE_INFO:
      if (!action.value) {
        break;
      }
      state = { ...state, dominanceInfo: _.cloneDeep(action.value) }
      break;

    case ACTIONS.UPDATE_MARKETCAP_INFO:
      if (!action.value) {
        break;
      }
      state = { ...state, marketCapInfos: _.cloneDeep(action.value) }
      break;      

    case ACTIONS.ADD_IMG_INFO:
      if (!action.value || action.value.length === 0 || !action.key) {
        break;
      }
      action.value.forEach((element: IImgInfo) => {
        if (action.key === IMG_TYPE.SYMBOL) {
          state.symbolImgMap.set(element.id, element);          
        } else if (action.key === IMG_TYPE.EXCHANGE) {
          state.exchangeImgMap.set(element.id, element);
        } else if (action.key === IMG_TYPE.ETC) {
          state.etcImgMap.set(element.id, element);
        }
      })
      break;

    case ACTIONS.UPDATE_EXCHANGE_COIN_INFO:
      if (!action.value || action.value.length === 0) {
        break;
      }
      state = { ...state, exchangeConinInfos: _.cloneDeep(action.value) }
      break;

    case ACTIONS.UPDATE_TRADE_WS_INFO:
      if (!action.value || action.value.length === 0 || !action.key) {
        break;
      }
      const tradeInfo: IAggTradeInfo = action.value;
      if (action.key === EXCHANGE.UPBIT) {
        state.upbitTradeWsInfoMap.get(tradeInfo.marketInfo.market)?.set(tradeInfo.coinPair, tradeInfo);
      } else if (action.key === EXCHANGE.BITHUMB) {
        state.bithumbTradeWsInfoMap.get(tradeInfo.marketInfo.market)?.set(tradeInfo.coinPair, tradeInfo);
      } else if (action.key === EXCHANGE.BINANCE) {
        state.binanceTradeWsInfoMap.get(tradeInfo.marketInfo.market)?.set(tradeInfo.coinPair, tradeInfo);
      } else if (action.key === EXCHANGE.BYBIT) {
        state.bybitTradeWsInfoMap.get(tradeInfo.marketInfo.market)?.set(tradeInfo.coinPair, tradeInfo);
      }
      break;

    case ACTIONS.UPDATE_ORDERBOOK_WS_INFO:
      if (!action.value || action.value.length === 0 || !action.key) {
        break;
      }
      const orderbook: IOrderBook = action.value;
      if (action.key === EXCHANGE.UPBIT) {
        state.upbitOrderBookWsInfoMap.get(orderbook.marketInfo.market)?.set(orderbook.coinPair, orderbook);
      } else if (action.key === EXCHANGE.BITHUMB) {
        state.bithumbOrderBookWsInfoMap.get(orderbook.marketInfo.market)?.set(orderbook.coinPair, orderbook);
      } else if (action.key === EXCHANGE.BINANCE) {
        state.binanceOrderBookWsInfoMap.get(orderbook.marketInfo.market)?.set(orderbook.coinPair, orderbook);
      } else if (action.key === EXCHANGE.BYBIT) {
        state.bybitOrderBookWsInfoMap.get(orderbook.marketInfo.market)?.set(orderbook.coinPair, orderbook);
      }
      break;

    default:
      break;
  }
  return state;
};

// Create the global store context
export const GlobalStoreContext = createContext<GlobalStoreType | undefined>(undefined);
  