'use client';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './PrimiumTableStyle.css'
import _ from "lodash"
import React, { useCallback, useMemo, useRef, useState, useEffect, MutableRefObject } from 'react';
import useExchange from '@/app/hook/useExchange';
import { useGlobalStore } from '@/app/hook/useGlobalStore';
import { EXCHANGE, MARKET, MARKET_CURRENCY, MARKET_TYPE, WS_TYPE } from '@/config/enum';
import { AdvancedRealTimeChart, AdvancedRealTimeChartProps } from 'react-ts-tradingview-widgets';
import { ExchangeDefaultInfo } from '@/config/constants';
import { IAggTradeInfo, IFilterCondition, IFilterModel, IMarketInfo, IMenuOption, IOrderBook, ISelectedExchangeMarket } from '@/config/interface';
import { calculatePrimium, calculateTether } from '@/app/lib/tradeHelper';
import { Button, Col, Row, TreeSelect, Select } from 'antd';
import { SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { PriceComp_1, PriceComp_2 } from './PriceComp';
import { PrimiumComp, PrimiumEnterComp, PrimiumExitComp } from './PrimiumComp';
import LoadingComp from '../LoadingComp';
import CustomTag from '../CustomTag';
import MenuItem from '../MenuItem';
import CoinTitle from '../CoinTitle';
import Favorite from '../Favorite';
import TetherComp from './TetherComp';
import { getMarketInfo } from '@/app/helper/cryptoHelper';

interface DataType {
  id: string;
  exchange_1: EXCHANGE,
  exchange_2: EXCHANGE,
  marketInfo_1: IMarketInfo,
  marketInfo_2: IMarketInfo,
  symbol: string,
  coinPair_1: string | null,
  coinPair_2: string | null,
  price_1: number;
  price_2: number;
  change_1?: number;
  change_24h_1?: number;
  change_2?: number;
  change_24h_2?: number;
  primium: number;
  primiumEnter: number;
  primiumExit: number;
  tether: number;
  tetherEnter: number;
  tetherExit: number;
  currency: number;
  favorite: boolean,
  symbolImg: string | undefined,
}

const defaultAdvancedRealTimeChartProps: AdvancedRealTimeChartProps = {
    autosize: true,
    //symbol: "UPBIT:BTCKRW",
    symbol: "NONE",
    interval: "240",
    // timezone?: Timezone;
    theme: "light",
    // style?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
    locale: "kr",    
    enable_publishing: true,
    allow_symbol_change: false,
    save_image: true,    
    show_popup_button: true,    
    // copyrightStyles: CopyrightStyles;
} 


const PrimiumTable: React.FC = () => {
  const {state} = useGlobalStore()
  const {startWebsocket} = useExchange()

  const advancedRealTimeChartPropsRef = useRef(defaultAdvancedRealTimeChartProps)
  const [advancedRealTimeChartProps, setAdvancedRealTimeChartProps] = useState(advancedRealTimeChartPropsRef.current)
  
  const gridRef = useRef<any>();
  const wsRef = useRef<Map<WS_TYPE, any>>(new Map<WS_TYPE, any>())

  const [rowData, setRowData] = useState<DataType[]>([]);
  const currenyPriceRef = useRef<number>(1300)
  const orderBookMapRef_1 = useRef<Map<string, IOrderBook>>(new Map<string, IOrderBook>())
  const orderBookMapRef_2 = useRef<Map<string, IOrderBook>>(new Map<string, IOrderBook>())
  const tradeMapRef_1 = useRef<Map<string, IAggTradeInfo>>(new Map<MARKET, IAggTradeInfo>())
  const tradeMapRef_2 = useRef<Map<string, IAggTradeInfo>>(new Map<MARKET, IAggTradeInfo>())
  const selectedRef_1 = useRef<ISelectedExchangeMarket>({exchange: EXCHANGE.NONE, marketInfo: {exchange: EXCHANGE.NONE, market: MARKET.NONE, marketType: MARKET_TYPE.NONE, marketCurrency: MARKET_CURRENCY.NONE}})
  const selectedRef_2 = useRef<ISelectedExchangeMarket>({exchange: EXCHANGE.NONE, marketInfo: {exchange: EXCHANGE.NONE, market: MARKET.NONE, marketType: MARKET_TYPE.NONE, marketCurrency: MARKET_CURRENCY.NONE}})
  const marketListRef = useRef<Map<EXCHANGE, IMenuOption>>(new Map<EXCHANGE, IMenuOption>);
  const [marketOptions_1, setMarketOptions_1] = useState<IMenuOption[]>([])
  const [marketOptions_2, setMarketOptions_2] = useState<IMenuOption[]>([])

  const filterRef = useRef<string[]>([])  
  const filterOptionRef = useRef<{value: string, lable: string}[]>([])  
  const [filterOption, setFilterOption] = useState<{value: string, lable: string}[]>(filterOptionRef.current)
  
  const isMountRef = useRef(false)
  const isLoadingRef = useRef(true);
  
  const columnDefs: any = [
    { headerName: '이름', field: 'symbol', minWidth: 160, cellRenderer: CoinTitle, filter: true, suppressMenu: true, filterParams: { maxNumConditions: 50, readOnly: true }},
    { headerName: '현재가격A', field: 'price_1', minWidth: 110, headerClass: 'ag-header-right', cellRenderer: PriceComp_1},
    { headerName: '현재가격B', field: 'price_2', minWidth: 110, headerClass: 'ag-header-right', cellRenderer: PriceComp_2},
    { headerName: '프리미엄', field: 'primium', minWidth: 90, headerClass: 'ag-header-right', cellRenderer: PrimiumComp},    
    { headerName: '진입 P', field: 'primiumEnter', minWidth: 80, headerClass: 'ag-header-right', cellRenderer: PrimiumEnterComp},    
    { headerName: '탈출 P', field: 'primiumExit', minWidth: 80, headerClass: 'ag-header-right', cellRenderer: PrimiumExitComp},
    { headerName: '테더', field: 'tether', minWidth: 80, headerClass: 'ag-header-right', cellRenderer: TetherComp},
    { headerName: '', field: 'favorite', minWidth: 50, headerClass: 'ag-header-center', cellRenderer: Favorite},
  ];  

  const createMarketListInfoMap = () => {
    let options: IMenuOption;
    options = { value: EXCHANGE.UPBIT, title: ExchangeDefaultInfo.upbit.exchange.label, selectable: false, children: [] }
    ExchangeDefaultInfo.upbit.markets.forEach((market: {label: string, marketInfo: IMarketInfo}) => {
      if (market.marketInfo.marketCurrency === MARKET_CURRENCY.KRW || market.marketInfo.marketCurrency === MARKET_CURRENCY.USDT) {
        options.children?.push({value: `${EXCHANGE.UPBIT}__${market.marketInfo.market}`, 
        title: <MenuItem title={market.label} img={state.exchangeImgMap.get(EXCHANGE.UPBIT.toLowerCase())?.path}/>,
        label: <MenuItem title={market.label} img={state.exchangeImgMap.get(EXCHANGE.UPBIT.toLowerCase())?.path}/>
      })}
    })
    marketListRef.current.set(EXCHANGE.UPBIT, options);

    options = { value: EXCHANGE.BITHUMB, title: ExchangeDefaultInfo.bithumb.exchange.label, selectable: false, children: [] }
    ExchangeDefaultInfo.bithumb.markets.forEach((market: {label: string, marketInfo: IMarketInfo}) => {
      if (market.marketInfo.marketCurrency === MARKET_CURRENCY.KRW || market.marketInfo.marketCurrency === MARKET_CURRENCY.USDT) {
        options.children?.push({value: `${EXCHANGE.BITHUMB}__${market.marketInfo.market}`, 
        title: <MenuItem title={market.label} img={state.exchangeImgMap.get(EXCHANGE.BITHUMB.toLowerCase())?.path}/>,
        label: <MenuItem title={market.label} img={state.exchangeImgMap.get(EXCHANGE.BITHUMB.toLowerCase())?.path}/>
      })}
    })
    marketListRef.current.set(EXCHANGE.BITHUMB, options);

    options = { value: EXCHANGE.BINANCE, title: ExchangeDefaultInfo.binance.exchange.label, selectable: false, children: [] }
    ExchangeDefaultInfo.binance.markets.forEach((market: {label: string, marketInfo: IMarketInfo}) => {
      if (market.marketInfo.marketCurrency === MARKET_CURRENCY.USDT 
        || market.marketInfo.marketCurrency === MARKET_CURRENCY.BUSD 
        || market.marketInfo.marketCurrency === MARKET_CURRENCY.USD
        || market.marketInfo.marketCurrency === MARKET_CURRENCY.USDC
        || market.marketInfo.marketCurrency === MARKET_CURRENCY.TUSD) {
          options.children?.push({value: `${EXCHANGE.BINANCE}__${market.marketInfo.market}`, 
        title: <MenuItem title={market.label} img={state.exchangeImgMap.get(EXCHANGE.BINANCE.toLowerCase())?.path}/>,
        label: <MenuItem title={market.label} img={state.exchangeImgMap.get(EXCHANGE.BINANCE.toLowerCase())?.path}/>
      })}
    })
    marketListRef.current.set(EXCHANGE.BINANCE, options);
    
    options = { value: EXCHANGE.BYBIT, title: ExchangeDefaultInfo.bybit.exchange.label, selectable: false, children: [] }
    ExchangeDefaultInfo.bybit.markets.forEach((market: {label: string, marketInfo: IMarketInfo}) => {
      if (market.marketInfo.marketCurrency === MARKET_CURRENCY.USDT) {
        options.children?.push({value: `${EXCHANGE.BYBIT}__${market.marketInfo.market}`, 
        title: <MenuItem title={market.label} img={state.exchangeImgMap.get(EXCHANGE.BYBIT.toLowerCase())?.path}/>,
        label: <MenuItem title={market.label} img={state.exchangeImgMap.get(EXCHANGE.BYBIT.toLowerCase())?.path}/>
      })}
    })
    marketListRef.current.set(EXCHANGE.BYBIT, options);
    
    let newMarketOption: IMenuOption[] = [];
    marketListRef.current.forEach((option: IMenuOption, key: EXCHANGE, map: Map<EXCHANGE, IMenuOption>) => {      
      newMarketOption.push(option)
    });
    setMarketOptions_1(newMarketOption)
    setMarketOptions_2(newMarketOption)
  }
  
  useEffect(() => {
    if (isMountRef.current === true) {
      return;
    }
    isMountRef.current = true;
    isLoadingRef.current = true;
    filterRef.current = [];

    createMarketListInfoMap();

    let options = marketListRef.current.get(EXCHANGE.UPBIT)
    let menuItem_1 = options?.children? options?.children[0]: {value: MARKET.SPOT_KRW, label: <MenuItem title={MARKET.SPOT_KRW} img={state.exchangeImgMap.get(EXCHANGE.UPBIT.toLowerCase())?.path}/>};
    options = marketListRef.current.get(EXCHANGE.BINANCE)
    let menuItem_2 = options?.children? options?.children[0]: {value: MARKET.SPOT_USDT, label: <MenuItem title={MARKET.SPOT_USDT} img={state.exchangeImgMap.get(EXCHANGE.BINANCE.toLowerCase())?.path}/>};
    selectedRef_1.current = {
      exchange: EXCHANGE.UPBIT,
      marketInfo: {exchange: EXCHANGE.UPBIT, market: MARKET.SPOT_KRW, marketType: MARKET_TYPE.SPOT, marketCurrency: MARKET_CURRENCY.KRW},
      menuItem: menuItem_1 }
    selectedRef_2.current = {
      exchange: EXCHANGE.BINANCE, 
      marketInfo: {exchange: EXCHANGE.BINANCE, market: MARKET.SPOT_USDT, marketType: MARKET_TYPE.SPOT, marketCurrency: MARKET_CURRENCY.USDT},
      menuItem: menuItem_2 }
    
    initialize();
    return () => {
      try {
        // eslint-disable-next-line react-hooks/exhaustive-deps 
        wsRef.current.forEach((ws: any, key: WS_TYPE) => {
          console.log("close websocket. key: ", key);
          ws?.close()
        })
      } catch {}
      isMountRef.current = false
    }
  }, [])

  const initialize = useCallback(async () => {
    isLoadingRef.current = true;    

    let newMarketOption_1: IMenuOption[] = [];
    let newMarketOption_2: IMenuOption[] = [];
    marketListRef.current.forEach((option: IMenuOption, key: EXCHANGE, map: Map<EXCHANGE, IMenuOption>) => { 
      // console.log("option ", option) 
      // console.log("selectedRef_2.current.exchange: ", selectedRef_2.current.exchange) 
      // console.log("selectedRef_2.current.market.value: ", selectedRef_2.current.market.value) 
      if (option.value.toLocaleLowerCase() === selectedRef_2.current.exchange.toLocaleLowerCase()) {
        let newChildren: IMenuOption[] = []
        option.children?.forEach((child: IMenuOption) => {
          if (child.value.split("__")[1]?.toLocaleLowerCase() === selectedRef_2.current.marketInfo.market.toLocaleLowerCase()) {
            child.selectable = false;
            child.disabled = true;
            // child.title = <MenuItem disabled={true} title={selectedRef_2.current.market.label} img={state.exchangeImgMap.get(selectedRef_2.current.exchange.toLowerCase())?.path}/>
            // child.label = <MenuItem title={selectedRef_2.current.market.label} img={state.exchangeImgMap.get(selectedRef_2.current.exchange.toLowerCase())?.path}/>
          } else {
            child.selectable = true;
            child.disabled = false;
          }
          newChildren.push(child);
        })
        option.children = _.cloneDeep(newChildren);
      }
      newMarketOption_1.push(option)
    });
    marketListRef.current.forEach((option: IMenuOption, key: EXCHANGE, map: Map<EXCHANGE, IMenuOption>) => {      
      if (option.value.toLocaleLowerCase() === selectedRef_1.current.exchange.toLocaleLowerCase()) {
        let newChildren: IMenuOption[] = []
        option.children?.forEach((child: IMenuOption) => {
          if (child.value.split("__")[1]?.toLocaleLowerCase() === selectedRef_1.current.marketInfo.market.toLocaleLowerCase()) {
            child.selectable = false;
            child.disabled = true;
          } else {
            child.selectable = true;
            child.disabled = false;
          }
          newChildren.push(child);
        })
        option.children = _.cloneDeep(newChildren);
      }
      newMarketOption_2.push(option)
    });
    setMarketOptions_1(newMarketOption_1)
    setMarketOptions_2(newMarketOption_2)

    wsRef.current.forEach((ws: any, key: WS_TYPE) => {
      console.log("close websocket. key: ", key);
      ws?.close()
    })
    setRowData([]);
    tradeMapRef_1.current.clear();
    orderBookMapRef_1.current.clear();
    tradeMapRef_2.current.clear();
    orderBookMapRef_2.current.clear();

    let promises: any = []
    promises.push(initWebsocket(selectedRef_1.current.exchange, orderBookMapRef_1, tradeMapRef_1, selectedRef_1));
    promises.push(initWebsocket(selectedRef_2.current.exchange, orderBookMapRef_2, tradeMapRef_2, selectedRef_2));
    await Promise.all(promises);
    let rawData: DataType[] = []
    tradeMapRef_1.current.forEach((value: IAggTradeInfo, key: string) => {
      if (tradeMapRef_2.current.has(key) === true) {
        let data = createDataType(key)
        if (data) rawData.push(data)
      }
    });
    setRowData(rawData)
    console.log("rawData: ", rawData.length)
    console.log("initWebsocket done!!!!")
    gridRef?.current?.api?.showLoadingOverlay();
    gridRef?.current?.api?.sizeColumnsToFit();
    changeTradingView(selectedRef_1.current.exchange, selectedRef_2.current.exchange, "BTC", selectedRef_1.current.marketInfo.marketCurrency, selectedRef_2.current.marketInfo.marketCurrency);
    isLoadingRef.current = false;
  }, [])

  const initWebsocket = useCallback(async (exchange: EXCHANGE, orderBookMapRef: MutableRefObject<Map<string, IOrderBook>>, tradeMapRef: MutableRefObject<Map<string, IAggTradeInfo>>, selectedRef: MutableRefObject<ISelectedExchangeMarket>) => {
    if (exchange === EXCHANGE.UPBIT) {
      await initUpbitWebSocket(orderBookMapRef, tradeMapRef, selectedRef);
    } else if (exchange === EXCHANGE.BITHUMB) {
      await initBithumbWebSocket(orderBookMapRef, tradeMapRef, selectedRef);
    } else if (exchange === EXCHANGE.BINANCE) {
      await initBinanceWebSocket(orderBookMapRef, tradeMapRef, selectedRef);
    } else if (exchange === EXCHANGE.BYBIT) {
      await initBybitWebSocket(orderBookMapRef, tradeMapRef, selectedRef);
    } else {
      console.error("fail initWebsocket. exchange: ", exchange);
    }
  }, [])
  
  const onGridReady = useCallback(() => {
    console.log("onGridReady");
    gridRef?.current?.api?.showLoadingOverlay();
    gridRef?.current?.api?.sizeColumnsToFit();
    window.onresize = () => {
      gridRef?.current?.api?.sizeColumnsToFit();
    }
  }, []);
  
  const createDataType = useCallback((symbol: string) => {
    const orderBook_1 = orderBookMapRef_1.current.get(symbol)
    const orderBook_2 = orderBookMapRef_2.current.get(symbol)
    const trade_1 = tradeMapRef_1.current.get(symbol)
    const trade_2 = tradeMapRef_2.current.get(symbol)
    const currency_1 = trade_1?.marketInfo.marketCurrency;
    const currency_2 = trade_2?.marketInfo.marketCurrency;
    if (!orderBook_1 && !orderBook_2 && !trade_1 && !trade_2) {
      return null;
    }
    let coinPair_1 = null    
    if (orderBook_1) coinPair_1 = orderBook_1.coinPair; 
    else if (trade_1) coinPair_1 = trade_1.coinPair;
    let coinPair_2 = null
    if (orderBook_2) coinPair_2 = orderBook_2.coinPair; 
    else if (trade_2) coinPair_2 = trade_2.coinPair;

    let price_1 = trade_1?.price ?? 0;
    let price_2 = trade_2?.price ?? 0;
    let askPrice_1 = orderBook_1?.ask[0]?.price ?? 0;
    let bidPrice_1 = orderBook_1?.bid[0]?.price ?? 0;
    let askPrice_2 = orderBook_2?.ask[0]?.price ?? 0;
    let bidPrice_2 = orderBook_2?.bid[0]?.price ?? 0;

    const currencyPrice = ((currency_1 === MARKET_CURRENCY.KRW && currency_2 === MARKET_CURRENCY.KRW) || (currency_1 === MARKET_CURRENCY.USD && currency_2 === MARKET_CURRENCY.USD))? 1: currenyPriceRef.current;

    let primium = calculatePrimium(price_1, price_2, currencyPrice)
    let primiumEnter = calculatePrimium(askPrice_1, bidPrice_2, currencyPrice)
    let primiumExit = calculatePrimium(bidPrice_1, askPrice_2, currencyPrice)
    let tether = calculateTether(primium, currencyPrice);
    let tetherEnter = calculateTether(primiumEnter, currencyPrice);
    let tetherExit = calculateTether(primiumExit, currencyPrice);

    const data: DataType = {
      id: symbol,
      symbol: symbol,
      exchange_1: selectedRef_1.current.exchange,
      exchange_2: selectedRef_2.current.exchange,
      marketInfo_1: {...selectedRef_1.current.marketInfo},
      marketInfo_2: {...selectedRef_2.current.marketInfo},
      coinPair_1: coinPair_1,
      coinPair_2: coinPair_2,
      price_1: price_1,
      price_2: price_2,
      change_1: trade_1?.change,
      change_24h_1: trade_1?.change_24h,
      change_2: trade_2?.change,
      change_24h_2: trade_2?.change_24h,
      primium: primium,
      primiumEnter: primiumEnter,
      primiumExit: primiumExit,
      tether: tether,
      tetherEnter: tetherEnter,
      tetherExit: tetherExit,
      currency: currenyPriceRef.current,
      favorite: false,
      symbolImg: state.symbolImgMap.get(symbol)?.path ?? undefined,
    }
    return data;
  }, [])

  const initUpbitWebSocket = useCallback((orderBookMapRef: MutableRefObject<Map<string, IOrderBook>>, tradeMapRef: MutableRefObject<Map<string, IAggTradeInfo>>, selectedRef: MutableRefObject<ISelectedExchangeMarket>) => {
    console.log("initUpbitWebSocket");
    let orderBookReady = false;
    let tradeReady = false;
    return new Promise(async (resolve) => {
      const codes: string[] = Array.from(state.exchangeConinInfos.get(EXCHANGE.UPBIT)?.keys() ?? []);
      const tickerWs = await startWebsocket(WS_TYPE.UPBIT_TICKER, codes, (aggTradeInfos: IAggTradeInfo[]) => {
        let rowData: DataType[] = []
        aggTradeInfos.forEach((aggTradeInfo: IAggTradeInfo) => {
          if (selectedRef.current.exchange !== aggTradeInfo.exchange || selectedRef.current.marketInfo.market !== aggTradeInfo.marketInfo.market) {
            return;
          }
          tradeMapRef.current.set(aggTradeInfo.symbol, aggTradeInfo);
          let data = createDataType(aggTradeInfo.symbol)
          if (data) rowData.push(data)
        });
  
        if (aggTradeInfos?.length > 1) {
          tradeReady = true;          
          if (orderBookReady === true && tradeReady === true) {
            console.log("UPBIT: ", tradeMapRef.current.size)
            resolve(true)
          }
          return;
        }
        if (aggTradeInfos?.length === 1) {
          if (isLoadingRef.current === true || rowData.length === 0 || rowData[0] === null) return;
          const rowNode = gridRef?.current?.api?.getRowNode(rowData[0].id);
          const preData: DataType = rowNode?.data;
          rowNode?.setData(rowData[0]);          
          if (preData) {
            if (preData.primium != rowData[0].primium || preData.primiumEnter != rowData[0].primiumEnter || preData.primiumExit != rowData[0].primiumExit 
              || preData.tether != rowData[0].tether || preData.tetherEnter != rowData[0].tetherEnter || preData.tetherExit != rowData[0].tetherExit) {
              gridRef?.current?.api?.flashCells({rowNodes: [rowNode], flashDelay: 400, fadeDelay: 100,})
            }
          } 
        }
      })
      wsRef.current.set(WS_TYPE.UPBIT_TICKER, tickerWs);
  
      const orderBookWs = await startWebsocket(WS_TYPE.UPBIT_ORDER_BOOK, codes, (orderBooks: IOrderBook[]) => {
        orderBooks.forEach((orderBook: IOrderBook) => {
          if (selectedRef.current.exchange !== orderBook.exchange || selectedRef.current.marketInfo.market !== orderBook.marketInfo.market) {
            return;
          }
          orderBookMapRef.current.set(orderBook.symbol, orderBook);
        });
  
        if (orderBooks?.length > 1) {
          orderBookReady = true;
          if (orderBookReady === true && tradeReady === true) {
            console.log("UPBIT: ", tradeMapRef.current.size)
            resolve(true)
          }
          return;
        }
  
        if (orderBooks?.length === 1) {
          if (isLoadingRef.current === true || rowData.length === 0 || rowData[0] === null) return;
          const rowNode = gridRef?.current?.api?.getRowNode(rowData[0].id);
          const preData: DataType = rowNode?.data;
          rowNode?.setData(rowData[0]);          
          if (preData) {
            if (preData.primium != rowData[0].primium || preData.primiumEnter != rowData[0].primiumEnter || preData.primiumExit != rowData[0].primiumExit 
              || preData.tether != rowData[0].tether || preData.tetherEnter != rowData[0].tetherEnter || preData.tetherExit != rowData[0].tetherExit) {
              gridRef?.current?.api?.flashCells({rowNodes: [rowNode], flashDelay: 400, fadeDelay: 100,})
            }
          } 
        }
      })
      wsRef.current.set(WS_TYPE.UPBIT_ORDER_BOOK, orderBookWs);
    })
  }, [])

  const initBinanceWebSocket = useCallback((orderBookMapRef: MutableRefObject<Map<string, IOrderBook>>, tradeMapRef: MutableRefObject<Map<string, IAggTradeInfo>>, selectedRef: MutableRefObject<ISelectedExchangeMarket>) => {    
    console.log("initBinanceWebSocket");
    return new Promise(async (resolve) => {
      let codes: string[] = Array.from(state.exchangeConinInfos.get(EXCHANGE.BINANCE)?.keys() ?? []);
      const spotTickerWs = await startWebsocket(WS_TYPE.BINANCE_SPOT_TICKER, codes, (aggTradeInfos: IAggTradeInfo[]) => {
        // console.log("aggTradeInfos: ", aggTradeInfos)
        if (aggTradeInfos && aggTradeInfos.length > 0) {
          if (selectedRef.current.exchange !== aggTradeInfos[0].exchange || selectedRef.current.marketInfo.marketType !== aggTradeInfos[0].marketInfo.marketType) {
            const ws = wsRef.current.get(WS_TYPE.BINANCE_SPOT_TICKER);
            ws?.close();
            wsRef.current.delete(WS_TYPE.BINANCE_SPOT_TICKER)
            return;
          }
        }
        aggTradeInfos.forEach((aggTradeInfo: IAggTradeInfo) => {
          if (selectedRef.current.exchange !== aggTradeInfo.exchange || selectedRef.current.marketInfo.market !== aggTradeInfo.marketInfo.market) {
            return;
          }
          if (aggTradeInfo.price === 0 || (!aggTradeInfo.bestBidPrice || !aggTradeInfo.bestAskPrice || aggTradeInfo.bestBidPrice === 0 && aggTradeInfo.bestAskPrice === 0)) {
            return;
          }
          tradeMapRef.current.set(aggTradeInfo.symbol, aggTradeInfo);
          const orderBook: IOrderBook = {
            exchange: aggTradeInfo.exchange,
            marketInfo: {...aggTradeInfo.marketInfo},
            symbol: aggTradeInfo.symbol,
            coinPair: aggTradeInfo.coinPair,
            bid: [{price: aggTradeInfo.bestBidPrice ?? 0, qty: aggTradeInfo.bestBidQty ?? 0}],
            ask: [{price: aggTradeInfo.bestAskPrice ?? 0, qty: aggTradeInfo.bestAskQty ?? 0}],
            timestamp: aggTradeInfo.timestamp,
          }
          orderBookMapRef.current.set(orderBook.symbol, orderBook);
        });

        if (aggTradeInfos?.length > 1) {
          console.log("BINANCE: ", tradeMapRef.current.size)
          resolve(true)
          return;
        }
        if (aggTradeInfos?.length === 1) {
          if (isLoadingRef.current === true || rowData.length === 0 || rowData[0] === null) return;
          const rowNode = gridRef?.current?.api?.getRowNode(rowData[0].id);
          const preData: DataType = rowNode?.data;
          rowNode?.setData(rowData[0]);          
          if (preData) {
            if (preData.primium != rowData[0].primium || preData.primiumEnter != rowData[0].primiumEnter || preData.primiumExit != rowData[0].primiumExit 
              || preData.tether != rowData[0].tether || preData.tetherEnter != rowData[0].tetherEnter || preData.tetherExit != rowData[0].tetherExit) {
              gridRef?.current?.api?.flashCells({rowNodes: [rowNode], flashDelay: 400, fadeDelay: 100,})
            }
          } 
        }
      })
      wsRef.current.set(WS_TYPE.BINANCE_SPOT_TICKER, spotTickerWs);

      const usdMFutureTickerWs = await startWebsocket(WS_TYPE.BINANCE_USD_M_FUTURE_TICKER, codes, (aggTradeInfos: IAggTradeInfo[]) => {
        if (aggTradeInfos && aggTradeInfos.length > 0) {
          if (selectedRef.current.exchange !== aggTradeInfos[0].exchange || selectedRef.current.marketInfo.marketType !== aggTradeInfos[0].marketInfo.marketType) {
            const ws = wsRef.current.get(WS_TYPE.BINANCE_USD_M_FUTURE_TICKER);
            ws?.close();
            console.log("close BINANCE_USD_M_FUTURE_TICKER")
            wsRef.current.delete(WS_TYPE.BINANCE_USD_M_FUTURE_TICKER)
            return;
          }
        }
        let rowData: DataType[] = []
        aggTradeInfos.forEach((aggTradeInfo: IAggTradeInfo) => {
          if (selectedRef.current.exchange !== aggTradeInfo.exchange || selectedRef.current.marketInfo.market !== aggTradeInfo.marketInfo.market) {
            return;
          }
          tradeMapRef.current.set(aggTradeInfo.symbol, aggTradeInfo);
          const orderBook: IOrderBook = {
            exchange: aggTradeInfo.exchange,
            marketInfo: {...aggTradeInfo.marketInfo},
            symbol: aggTradeInfo.symbol,
            coinPair: aggTradeInfo.coinPair,
            bid: [{price: aggTradeInfo.bestBidPrice ?? 0, qty: aggTradeInfo.bestBidQty ?? 0}],
            ask: [{price: aggTradeInfo.bestAskPrice ?? 0, qty: aggTradeInfo.bestAskQty ?? 0}],
            timestamp: aggTradeInfo.timestamp,
          }
          orderBookMapRef.current.set(orderBook.symbol, orderBook);
        });
  
        if (aggTradeInfos?.length > 1) {
          console.log("BINANCE_USD_M_FUTURE_TICKER: ", tradeMapRef.current.size)
          resolve(true)
          return;
        }
        if (aggTradeInfos?.length === 1) {
          if (isLoadingRef.current === true || rowData.length === 0 || rowData[0] === null) return;
          const rowNode = gridRef?.current?.api?.getRowNode(rowData[0].id);
          const preData: DataType = rowNode?.data;
          rowNode?.setData(rowData[0]);          
          if (preData) {
            if (preData.primium != rowData[0].primium || preData.primiumEnter != rowData[0].primiumEnter || preData.primiumExit != rowData[0].primiumExit 
              || preData.tether != rowData[0].tether || preData.tetherEnter != rowData[0].tetherEnter || preData.tetherExit != rowData[0].tetherExit) {
              gridRef?.current?.api?.flashCells({rowNodes: [rowNode], flashDelay: 400, fadeDelay: 100,})
            }
          } 
        }
      })
      wsRef.current.set(WS_TYPE.BINANCE_USD_M_FUTURE_TICKER, usdMFutureTickerWs);
  
      const coinMFutureTickerWs = await startWebsocket(WS_TYPE.BINANCE_COIN_M_FUTURE_TICKER, codes, (aggTradeInfos: IAggTradeInfo[]) => {
      if (aggTradeInfos && aggTradeInfos.length > 0) {
        if (selectedRef.current.exchange !== aggTradeInfos[0].exchange || selectedRef.current.marketInfo.marketType !== aggTradeInfos[0].marketInfo.marketType) {
          const ws = wsRef.current.get(WS_TYPE.BINANCE_COIN_M_FUTURE_TICKER);
          ws?.close();
          console.log("close BINANCE_COIN_M_FUTURE_TICKER")
          wsRef.current.delete(WS_TYPE.BINANCE_COIN_M_FUTURE_TICKER)
          return;
        }
      }
      let rowData: DataType[] = []
      aggTradeInfos.forEach((aggTradeInfo: IAggTradeInfo) => {
        if (selectedRef.current.exchange !== aggTradeInfo.exchange || selectedRef.current.marketInfo.market !== aggTradeInfo.marketInfo.market) {
          return;
        }
        tradeMapRef.current.set(aggTradeInfo.symbol, aggTradeInfo);
        const orderBook: IOrderBook = {
          exchange: aggTradeInfo.exchange,
          marketInfo: {...aggTradeInfo.marketInfo},
          symbol: aggTradeInfo.symbol,
          coinPair: aggTradeInfo.coinPair,
          bid: [{price: aggTradeInfo.bestBidPrice ?? 0, qty: aggTradeInfo.bestBidQty ?? 0}],
          ask: [{price: aggTradeInfo.bestAskPrice ?? 0, qty: aggTradeInfo.bestAskQty ?? 0}],
          timestamp: aggTradeInfo.timestamp,
        }
        orderBookMapRef.current.set(orderBook.symbol, orderBook);
      });

      if (aggTradeInfos?.length > 1) {
        console.log("BINANCE_COIN_M_FUTURE_TICKER: ", tradeMapRef.current.size)
        resolve(true)
        return;
      }
      if (aggTradeInfos?.length === 1) {
        if (isLoadingRef.current === true || rowData.length === 0 || rowData[0] === null) return;
        const rowNode = gridRef?.current?.api?.getRowNode(rowData[0].id);
        const preData: DataType = rowNode?.data;
        rowNode?.setData(rowData[0]);          
        if (preData) {
          if (preData.primium != rowData[0].primium || preData.primiumEnter != rowData[0].primiumEnter || preData.primiumExit != rowData[0].primiumExit 
            || preData.tether != rowData[0].tether || preData.tetherEnter != rowData[0].tetherEnter || preData.tetherExit != rowData[0].tetherExit) {
            gridRef?.current?.api?.flashCells({rowNodes: [rowNode], flashDelay: 400, fadeDelay: 100,})
          }
        } 
      }
    })
    wsRef.current.set(WS_TYPE.BINANCE_COIN_M_FUTURE_TICKER, coinMFutureTickerWs);
    })
  }, [])

  const initBithumbWebSocket = useCallback(async (orderBookMapRef: MutableRefObject<Map<string, IOrderBook>>, tradeMapRef: MutableRefObject<Map<string, IAggTradeInfo>>, selectedRef: MutableRefObject<ISelectedExchangeMarket>) => {
    console.error("initBithumbWebSocket")
  }, [])

  const initBybitWebSocket = useCallback(async (orderBookMapRef: MutableRefObject<Map<string, IOrderBook>>, tradeMapRef: MutableRefObject<Map<string, IAggTradeInfo>>, selectedRef: MutableRefObject<ISelectedExchangeMarket>) => {
    console.error("initBybitWebSocket")
  }, [])

  const onFilterTagChanged = useCallback((tags: any) => {
    let filters: IFilterCondition[] = []
    tags?.forEach((tag: string) => {
      filters.push({ filterType: "text", type: "contains", filter: tag })
    })
    const model: IFilterModel = {
      symbol: { filterType: "text", operator: "OR", conditions: filters }
    }
    gridRef?.current?.api?.setFilterModel(model)
    // console.log("savedModel: ", gridRef?.current?.api?.getFilterModel())
  }, []);

  const getRowId = useMemo(() => {
    return (params: any) => {
      // console.log(params)
      return params.data.id;
    };
  }, []);

  const changeTradingView = useCallback((exchange_1: EXCHANGE, exchange_2: EXCHANGE, symbol: string, market_1: string, market_2: string) => {
    const currency_1 = market_1.includes(MARKET_CURRENCY.KRW)? MARKET_CURRENCY.KRW : MARKET_CURRENCY.USD;
    const currency_2 = market_2.includes(MARKET_CURRENCY.KRW)? MARKET_CURRENCY.KRW : MARKET_CURRENCY.USD;
    let newSymbol = ""
    // ( -1) * 100\
    // BINANCE:SANDUSDT*UPBIT:SANDKRW
    // --------------------------------------------------
    //FX_IDC:USDKRW

    //(BINANCE:SANDUSDT/BINANCE:SANDUSDT*UPBIT:SANDKRW-BINANCE:SANDUSDT*FX_IDC:USDKRW)/(BINANCE:SANDUSDT*FX_IDC:USDKRW)*100
    // newSymbol = `(${exchange_2}:${symbol}${market_2}/${exchange_2}:${symbol}${market_2}*${exchange_1}:${symbol}${market_1}-${exchange_2}:${symbol}${market_2}*FX_IDC:USDKRW)/(${exchange_2}:${symbol}${market_2}*FX_IDC:USDKRW)*100`;
    // return wrapNumber((price1 / (price2 * currency) - 1) * 100);

    if (currency_1 === MARKET_CURRENCY.KRW && currency_2 === MARKET_CURRENCY.USD) {
      newSymbol = `(${exchange_2}:${symbol}${market_2}/${exchange_2}:${symbol}${market_2}*${exchange_1}:${symbol}${market_1}-${exchange_2}:${symbol}${market_2}*FX_IDC:USDKRW)/(${exchange_2}:${symbol}${market_2}*FX_IDC:USDKRW)*100`;
      // newSymbol = `((${exchange_1}:${symbol}${market_1}/(${exchange_2}:${symbol}${market_2}*FX_IDC:USDKRW) - 1) * 100)`;
    } else if (currency_1 === MARKET_CURRENCY.USD && currency_2 === MARKET_CURRENCY.KRW) {
      newSymbol = `(${exchange_2}:${symbol}${market_2}/${exchange_2}:${symbol}${market_2}*${exchange_1}:${symbol}${market_1}*FX_IDC:USDKRW-${exchange_2}:${symbol}${market_2})/(${exchange_2}:${symbol}${market_2})*100`;
      // newSymbol = `((${exchange_1}:${symbol}${market_1}*FX_IDC:USDKRW)/${exchange_2}:${symbol}${market_2} - 1) * 100)`;
    } else {
      newSymbol = `(${exchange_2}:${symbol}${market_2}/${exchange_2}:${symbol}${market_2}*${exchange_1}:${symbol}${market_1}-${exchange_2}:${symbol}${market_2})/(${exchange_2}:${symbol}${market_2})*100`;
      // newSymbol = `((${exchange_1}:${symbol}${market_1}/${exchange_2}:${symbol}${market_2} - 1) * 100)`;
    }
    
    // console.log("newSymbol: ", newSymbol)
    advancedRealTimeChartPropsRef.current = {...advancedRealTimeChartPropsRef.current, symbol: newSymbol}
    setAdvancedRealTimeChartProps(advancedRealTimeChartPropsRef.current)
  }, [])

  const onRowClicked = useCallback((event: any) => {
    // console.log("onRowClicked. event: ", event)
    changeTradingView(event.data.exchange_1, event.data.exchange_2, event.data.symbol, event.data.marketInfo_1.marketCurrency, event.data.marketInfo_2.marketCurrency);
  }, [])

  const handleMarketChange_1 = useCallback((value: any, label: any) => {
    const exchange: EXCHANGE = value?.split("__")[0];
    const market: MARKET = value?.split("__")[1];
    const marketInfo = getMarketInfo(exchange, market)
    selectedRef_1.current = { exchange: value?.split("__")[0], marketInfo: {...marketInfo}, menuItem: {value: market, label} }
    initialize();
    changeTradingView(selectedRef_1.current.exchange, selectedRef_2.current.exchange, "BTC", selectedRef_1.current.marketInfo.marketCurrency, selectedRef_2.current.marketInfo.marketCurrency);
  }, []);

  const handleMarketChange_2 = useCallback((value: any, label: any) => {
    const exchange: EXCHANGE = value?.split("__")[0];
    const market: MARKET = value?.split("__")[1];
    const marketInfo = getMarketInfo(exchange, market)
    selectedRef_2.current = { exchange: exchange, marketInfo: {...marketInfo}, menuItem: {value: market, label} }
    initialize();
    changeTradingView(selectedRef_1.current.exchange, selectedRef_2.current.exchange, "BTC", selectedRef_1.current.marketInfo.marketCurrency, selectedRef_2.current.marketInfo.marketCurrency);
  }, []);

  if (!rowData) {
    return null;
  }

  return (    
    <div style={{display: "flex", flexDirection: "column", flex: 1, height: "100%", width: "100%", alignItems: "center"}}>
      <Row style={{flex: 1, height: "100%", width: "100%"}}>
        <Col span={14} style={{padding: 5}}>
          <div style={{width: "100%", height: "50%"}}>
            <AdvancedRealTimeChart
              symbol={advancedRealTimeChartProps.symbol}
              autosize={advancedRealTimeChartProps.autosize} 
              interval={advancedRealTimeChartProps.interval}
              theme={advancedRealTimeChartProps.theme} 
              locale={advancedRealTimeChartProps.locale}
              enable_publishing={advancedRealTimeChartProps.enable_publishing}
              allow_symbol_change={advancedRealTimeChartProps.allow_symbol_change}
              save_image={advancedRealTimeChartProps.save_image}
              show_popup_button={advancedRealTimeChartProps.show_popup_button}
            />
          </div>
        </Col>    
        <Col span={10} style={{padding: 5}} className="ag-theme-alpine">
          <div style={{display: 'flex', flexDirection: "row", width: "100%", height: "50px", backgroundColor: "#192331", margin:0, padding: "0px 16px", justifyContent: "space-between", alignItems: "center"}}>
            <Select
              tagRender={CustomTag}
              mode="tags"
              style={{ backgroundColor: "transparent", margin: "0px 5px", padding: 0, flex: 1}}
              placeholder="필터"
              bordered={true}
              onChange={onFilterTagChanged}
              className="table-select"
              suffixIcon={<SearchOutlined style={{fontSize: "20px"}}/>}
              options={filterOption}
            />      
            <TreeSelect
              // showSearch
              style={{ width: 160, margin: "0px 5px" }}
              value={selectedRef_1.current.menuItem}
              dropdownStyle={{ maxHeight: 400, minWidth: 200, overflow: 'auto' }}
              placeholder="마켓_1"
              treeDefaultExpandAll
              popupMatchSelectWidth={false}
              onChange={handleMarketChange_1}
              treeData={marketOptions_1}
            />
            <TreeSelect
              // showSearch
              style={{ width: 160, margin: "0px 5px" }}
              value={selectedRef_2.current.menuItem}
              dropdownStyle={{ maxHeight: 400, minWidth: 200, overflow: 'auto' }}
              placeholder="마켓_2"
              treeDefaultExpandAll
              popupMatchSelectWidth={false}
              onChange={handleMarketChange_2}
              treeData={marketOptions_2}
            />
            <Button shape="circle" style={{backgroundColor: 'whitesmoke', margin: "0px 5px"}} icon={<SettingOutlined style={{color: "#192331", fontSize: "20px"}}/>} />
          </div>
          <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={{ sortable: true, resizable: false}}
              cacheQuickFilter={true}
              onGridReady={onGridReady}
              getRowId={getRowId}
              rowHeight={50}
              rowBuffer={50}
              className='myGrid'
              loadingOverlayComponent={LoadingComp}
              onRowClicked={onRowClicked}
          />
        </Col>
      </Row>
    </div>
  );
};

export default PrimiumTable;