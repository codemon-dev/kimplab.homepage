'use client';

import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AdvancedRealTimeChart, AdvancedRealTimeChartProps } from "react-ts-tradingview-widgets";

import _ from 'lodash'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './CoinPriceTableStyle.css';

import useExchange from '@/app/hook/useExchange';
import { useGlobalStore } from '@/app/hook/useGlobalStore';

import { AgGridReact } from 'ag-grid-react';
import { EXCHANGE, MARKET, MARKET_CURRENCY, MARKET_TYPE, WS_TYPE } from '@/config/enum';
import { IAggTradeInfo, IFilterCondition, IFilterModel, IMarketInfo, IMenuOption, ISelectedExchangeMarket } from '@/config/interface';

import { SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Col, Row, Select } from 'antd';

import PriceChangeComp from './PriceChangeComp';
import PriceComp from './PriceComp';
import VolumeComp from './VolumeComp';
import HighLowPriceComp from './HighLowPriceComp';
import { ExchangeDefaultInfo } from '@/config/constants';
import { getMarketInfo } from '@/app/helper/cryptoHelper';
import CoinTitle from '@/app/components/CoinTitle';
import MenuItem from '@/app/components/MenuItem';
import Favorite from '@/app/components/Favorite';
import AdVancedRealTimeChart from '@/app/components/TradingViewWidget/AdVancedRealTimeChart';
import LoadingComp from '@/app/components/LoadingComp';
import CustomTag from '@/app/components/CustomTag';


interface DataType {
  id: string;
  exchange: EXCHANGE,
  marketInfo: IMarketInfo,
  symbol: string,
  coinPair: string,
  price: number;
  preClosingPrice: number;
  askBid: number;
  change?: number;
  change_24h?: number;
  changeRate?: number;
  changeRate_24h?: number;
  accVolume?: number,
  accVolume_24h?: number,
  accTradePrice?: number,
  accTradePrice_24h?: number,
  high?: number,
  high_24h?: number,
  low?: number,
  low_24h?: number,
  favorite: boolean,
  symbolImg: string | undefined,
}

const defaultAdvancedRealTimeChartProps: AdvancedRealTimeChartProps = {
    autosize: true,
    // symbol: "UPBIT:BTCKRW",
    symbol: "NONE",
    interval: "240",
    // timezone?: Timezone;
    theme: "light",
    // style?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
    locale: "kr",    
    enable_publishing: false,
    allow_symbol_change: false,
    save_image: true,    
    show_popup_button: true,
    withdateranges: true,
    // copyrightStyles: CopyrightStyles;
}

const CoinPriceTable: React.FC = () => {
  const {state} = useGlobalStore()
  const advancedRealTimeChartPropsRef = useRef(defaultAdvancedRealTimeChartProps)
  const [advancedRealTimeChartProps, setAdvancedRealTimeChartProps] = useState(advancedRealTimeChartPropsRef.current)
  const {startWebsocket} = useExchange()
  const [isLoading, setIsLoading] = useState(true);
  const [rowData, setRowData] = useState<DataType[]>([]);
  const selectedRef = useRef<ISelectedExchangeMarket>({exchange: EXCHANGE.UPBIT, marketInfo: {exchange: EXCHANGE.UPBIT, market: MARKET.SPOT_KRW, marketType: MARKET_TYPE.SPOT, marketCurrency: MARKET_CURRENCY.KRW}})
  const [selectedExchange, setSelectedExchange] = useState<EXCHANGE>(selectedRef.current.exchange)
  const [selectedMarket, setSelectedMarket] = useState<IMarketInfo>(selectedRef.current.marketInfo)  
  const [marketOptions, setMarketOptions] = useState<IMenuOption[]>([])
  const wsRef = useRef<Map<WS_TYPE, any>>(new Map<WS_TYPE, any>())
  const gridRef = useRef<any>();
  const isMountRef = useRef(false)
  const filterRef = useRef<string[]>([])  

  const upbitDataTableRef = useRef<Map<MARKET, DataType[]>>(new Map<MARKET, DataType[]>())
  const bithumbDataTableRef = useRef<Map<MARKET, DataType[]>>(new Map<MARKET, DataType[]>())
  const binanceDataTableRef = useRef<Map<MARKET, DataType[]>>(new Map<MARKET, DataType[]>())
  const bybitDataTableRef = useRef<Map<MARKET, DataType[]>>(new Map<MARKET, DataType[]>())
  const filterOptionRef = useRef<{value: string, lable: string}[]>([])  
  const [filterOption, setFilterOption] = useState<{value: string, lable: string}[]>(filterOptionRef.current)
  
  const columnDefs: any = [
    { headerName: '이름', field: 'symbol', minWidth: 160, cellRenderer: CoinTitle, filter: true, suppressMenu: true, filterParams: { maxNumConditions: 25, readOnly: true }},
    { headerName: '현재가격', field: 'price', minWidth: 120, headerClass: 'ag-header-right', cellRenderer: PriceComp },
    { headerName: '가격변동', field: 'changeRate', minWidth: 100, headerClass: 'ag-header-right', cellRenderer: PriceChangeComp},    
    { headerName: '최고/최저', field: 'highLowPrice', minWidth: 150, headerClass: 'ag-header-right', cellRenderer: HighLowPriceComp},    
    { headerName: '누적거래량', field: 'accTradePrice_24h', minWidth: 120, headerClass: 'ag-header-right', cellRenderer: VolumeComp},
    { headerName: '', field: 'favorite', minWidth: 50, headerClass: 'ag-header-center', cellRenderer: Favorite},
  ];

  const exchangeList: IMenuOption[] = [
    {...ExchangeDefaultInfo.upbit.exchange, 
      label: <MenuItem img={state.exchangeImgMap.get(ExchangeDefaultInfo.upbit.exchange.value.toLowerCase())?.path} title={ExchangeDefaultInfo.upbit.exchange.label} />
    },
    {...ExchangeDefaultInfo.bithumb.exchange, 
      label: <MenuItem img={state.exchangeImgMap.get(ExchangeDefaultInfo.bithumb.exchange.value.toLowerCase())?.path} title={ExchangeDefaultInfo.bithumb.exchange.label} />
    },
    {...ExchangeDefaultInfo.binance.exchange, 
      label: <MenuItem img={state.exchangeImgMap.get(ExchangeDefaultInfo.binance.exchange.value.toLowerCase())?.path} title={ExchangeDefaultInfo.binance.exchange.label} />
    },
    {...ExchangeDefaultInfo.bybit.exchange, 
      label: <MenuItem img={state.exchangeImgMap.get(ExchangeDefaultInfo.bybit.exchange.value.toLowerCase())?.path} title={ExchangeDefaultInfo.bybit.exchange.label} />
    },
  ]  

  let exhcnageInfoMap: Map<EXCHANGE, IMenuOption[]> = new Map<EXCHANGE, IMenuOption[]>();
  exhcnageInfoMap.set(EXCHANGE.UPBIT, ExchangeDefaultInfo.upbit.markets)
  exhcnageInfoMap.set(EXCHANGE.BITHUMB, ExchangeDefaultInfo.bithumb.markets)
  exhcnageInfoMap.set(EXCHANGE.BINANCE, ExchangeDefaultInfo.binance.markets)
  exhcnageInfoMap.set(EXCHANGE.BYBIT, ExchangeDefaultInfo.bybit.markets)

  const createMarketList = (markets: IMenuOption[]) => {
    if (!markets || markets.length === 0) return [];
    let newMarket: IMenuOption[] = []
    markets.forEach((market: IMenuOption) => {
      newMarket.push({...market, label: <MenuItem img={state.etcImgMap.get(market.label)?.path} title={market.label} /> })
    })
    return newMarket;
  }

  useEffect(() => {
    if (isMountRef.current === true) {
      return;
    }
    isMountRef.current = true;
    selectedRef.current = {exchange: EXCHANGE.UPBIT, marketInfo: {exchange: EXCHANGE.UPBIT, market: MARKET.SPOT_KRW, marketType: MARKET_TYPE.SPOT, marketCurrency: MARKET_CURRENCY.KRW}};
    initialize();
    return () => {
      try {
        // eslint-disable-next-line react-hooks/exhaustive-deps 
        wsRef.current.forEach((ws: any, key: WS_TYPE) => {
          console.log("close websocket. ws: ", key);
          ws?.close()
        })
      } catch {}
      isMountRef.current = false
    }
  }, [])

  const initialize = async () => {
    console.log("initialize")
    filterRef.current = [];
    let markets = exhcnageInfoMap.get(selectedRef.current.exchange)
    if (!markets) return;
    setMarketOptions(createMarketList(markets));
    wsRef.current.forEach((ws: any, key: WS_TYPE) => {
      console.log("close websocket. ws: ", key);
      ws?.close()
    })
    setRowData([]);    
    if (selectedRef.current.exchange === EXCHANGE.UPBIT) {
      await initUpbitWebSocket();
    } else if (selectedRef.current.exchange === EXCHANGE.BITHUMB) {
      await initBithumbWebSocket();
    } else if (selectedRef.current.exchange === EXCHANGE.BINANCE) {
      await initBinanceWebSocket();
    } else if (selectedRef.current.exchange === EXCHANGE.BYBIT) {
      await initBybitWebSocket();
    }
    setSelectedRowData();
    changeTradingView(selectedRef.current.exchange, getFirstSymbolFromExchange(selectedRef.current.exchange, selectedRef.current.marketInfo.market), selectedRef.current.marketInfo.marketCurrency)
    sizeColumnsToFit();
  }

  const getFirstSymbolFromExchange = (exchange: EXCHANGE, market: MARKET) => {
    let dataTypeList: DataType[] = []
    if (exchange === EXCHANGE.UPBIT) {
      dataTypeList = upbitDataTableRef.current.get(market) ?? [];
    } else if (exchange === EXCHANGE.BITHUMB) {
      dataTypeList = bithumbDataTableRef.current.get(market) ?? [];
    } else if (exchange === EXCHANGE.BINANCE) {
      dataTypeList = binanceDataTableRef.current.get(market) ?? [];
    } else if (exchange === EXCHANGE.BYBIT) {
      dataTypeList = bybitDataTableRef.current.get(market) ?? [];
    }
    return dataTypeList[0]?.symbol;
  }

  const setSelectedRowData = () => {
    if (selectedRef.current.exchange === EXCHANGE.UPBIT) {
      setRowData([...upbitDataTableRef.current.get(selectedRef.current.marketInfo.market) ?? []]);
      const dataTables: DataType[] = upbitDataTableRef.current.get(selectedRef.current.marketInfo.market) ?? []
      let options: {value: string, lable: string}[]  = []
      dataTables.forEach((data: DataType) => {
        options.push({value: data.symbol, lable: data.symbol.toUpperCase()})
      })
      filterOptionRef.current = [...options];
    } else if (selectedRef.current.exchange === EXCHANGE.BITHUMB) {
      setRowData([...bithumbDataTableRef.current.get(selectedRef.current.marketInfo.market) ?? []]);
      const dataTables: DataType[] = bithumbDataTableRef.current.get(selectedRef.current.marketInfo.market) ?? []
      let options: {value: string, lable: string}[]  = []
      dataTables.forEach((data: DataType) => {
        options.push({value: data.symbol, lable: data.symbol.toUpperCase()})
      })
      filterOptionRef.current = [...options];
    } else if (selectedRef.current.exchange === EXCHANGE.BINANCE) {
      setRowData([...binanceDataTableRef.current.get(selectedRef.current.marketInfo.market) ?? []]);
      const dataTables: DataType[] = binanceDataTableRef.current.get(selectedRef.current.marketInfo.market) ?? []
      let options: {value: string, lable: string}[]  = []
      dataTables.forEach((data: DataType) => {
        options.push({value: data.symbol, lable: data.symbol.toUpperCase()})
      })
      filterOptionRef.current = [...options];
    } else if (selectedRef.current.exchange === EXCHANGE.BYBIT) {
      setRowData([...bybitDataTableRef.current.get(selectedRef.current.marketInfo.market) ?? []]);
      const dataTables: DataType[] = bybitDataTableRef.current.get(selectedRef.current.marketInfo.market) ?? []
      let options: {value: string, lable: string}[]  = []
      dataTables.forEach((data: DataType) => {
        options.push({value: data.symbol, lable: data.symbol.toUpperCase()})
      })
      filterOptionRef.current = [...options];
    }
    setFilterOption(filterOptionRef.current)
    changeTradingView(selectedRef.current.exchange, getFirstSymbolFromExchange(selectedRef.current.exchange, selectedRef.current.marketInfo.market), selectedRef.current.marketInfo.marketCurrency)
    sizeColumnsToFit();
  }

  const onGridReady = useCallback(() => {
    console.log("onGridReady");
    gridRef?.current?.api?.showLoadingOverlay();
    setSelectedRowData();
    sizeColumnsToFit();
    window.onresize = () => {
      sizeColumnsToFit();
    }
  }, []);

  const sizeColumnsToFit = useCallback(() => {
    gridRef?.current?.api?.sizeColumnsToFit();
  }, [])

  const createDataType = (aggTradeInfo: IAggTradeInfo) => {
    const data: DataType = {
      id: `${aggTradeInfo.exchange}_${aggTradeInfo.marketInfo.market}_${aggTradeInfo.coinPair}`,
      exchange: aggTradeInfo.exchange,
      marketInfo: aggTradeInfo.marketInfo,
      symbol: aggTradeInfo.symbol,
      coinPair: aggTradeInfo.coinPair,
      price: aggTradeInfo.price,
      preClosingPrice: aggTradeInfo.preClosingPrice,
      askBid: aggTradeInfo.askBid,
      change: aggTradeInfo.change,
      change_24h: aggTradeInfo.change_24h,
      changeRate: aggTradeInfo.changeRate,
      changeRate_24h: aggTradeInfo.changeRate_24h,
      accVolume: aggTradeInfo.accVolume,
      accVolume_24h: aggTradeInfo.accVolume_24h,
      accTradePrice: aggTradeInfo.accTradePrice,
      accTradePrice_24h: aggTradeInfo.accTradePrice_24h,
      high: aggTradeInfo.high,
      high_24h: aggTradeInfo.high_24h,
      low: aggTradeInfo.low,
      low_24h: aggTradeInfo.low_24h,
      favorite: false,
      symbolImg: state.symbolImgMap.get(aggTradeInfo.symbol)?.path ?? undefined,
    }
    return data;
  }

  const initUpbitWebSocket = async () => {
    console.log("initUpbitWebSocket")
  // let exchangeTickers: any = await coinGecko_getExchangeTickers(EXCHANGE.UPBIT);
    const codes: string[] = Array.from(state.exchangeConinInfos.get(EXCHANGE.UPBIT)?.keys() ?? []);
    const ws = await startWebsocket(WS_TYPE.UPBIT_TICKER, codes, (aggTradeInfos: IAggTradeInfo[]) => {
      if (aggTradeInfos?.length > 1) {
        aggTradeInfos.forEach((aggTradeInfo: IAggTradeInfo) => {
          let index = upbitDataTableRef.current.get(aggTradeInfo.marketInfo.market)?.findIndex((data: DataType) => {
            return (data.coinPair === aggTradeInfo.coinPair && data.exchange === aggTradeInfo.exchange && data.marketInfo.market === aggTradeInfo.marketInfo.market)
          })
          const data: DataType = createDataType(aggTradeInfo);
          let newDataTable = upbitDataTableRef.current.get(data.marketInfo.market) ?? [];
          if (index === undefined || index === -1) {
            newDataTable.push(data)
          } else {        
            newDataTable[index] = data;
          }
          upbitDataTableRef.current.set(data.marketInfo.market, newDataTable);
        })
        // console.log("upbitDataTableRef.current: ", upbitDataTableRef.current)
        setSelectedRowData();
        setIsLoading(false);
        gridRef?.current?.api?.sizeColumnsToFit();
        gridRef?.current?.api?.hideOverlay();
        return;
      }
      
      aggTradeInfos.forEach((aggTradeInfo: IAggTradeInfo) => {
        let index = upbitDataTableRef.current.get(aggTradeInfo.marketInfo.market)?.findIndex((data: DataType) => {
          return (data.coinPair === aggTradeInfo.coinPair && data.exchange === aggTradeInfo.exchange && data.marketInfo.market === aggTradeInfo.marketInfo.market)
        })
        // console.log(state.symbolImgMap.get(aggTradeInfo.symbol))
        const data: DataType = createDataType(aggTradeInfo);
        let preData = null;
        let newDataTable = upbitDataTableRef.current.get(data.marketInfo.market) ?? [];
        if (index === undefined || index === -1) {
          newDataTable.push(data)
        } else {        
          preData = {...newDataTable[index]}
          newDataTable[index] = data;
        }      
        upbitDataTableRef.current.set(data.marketInfo.market, newDataTable);
        if (selectedRef.current.exchange !== data.exchange || selectedRef.current.marketInfo.market !== data.marketInfo.market) {
          return;
        }
        const rowNode = gridRef?.current?.api?.getRowNode(data.id);
        if (!rowNode) { return; }
        rowNode.setData(data);     
        if (preData) {
          if (preData.price != data.price) {
            gridRef?.current?.api?.flashCells({rowNodes: [rowNode], flashDelay: 400, fadeDelay: 100,})
          }
        }
      })
    })
    wsRef.current.set(WS_TYPE.UPBIT_TICKER, ws);
  }

  const initBinanceWebSocket = async () => {
    console.log("initBinanceWebSocket")
    let codes: string[] = Array.from(state.exchangeConinInfos.get(EXCHANGE.BINANCE)?.keys() ?? []);
    let spotReady = false;
    let usdMfutureReady = false;
    let coinMfutureReady = false;
    
    // spot market
    let ws = await startWebsocket(WS_TYPE.BINANCE_SPOT_TICKER, codes, (aggTradeInfos: IAggTradeInfo[]) => {
      // console.log("aggTradeInfos: ", aggTradeInfos)
      if (aggTradeInfos?.length > 1) {
        aggTradeInfos.forEach((aggTradeInfo: IAggTradeInfo) => {
          let index = binanceDataTableRef.current.get(aggTradeInfo.marketInfo.market)?.findIndex((data: DataType) => {
            return (data.coinPair === aggTradeInfo.coinPair && data.exchange === aggTradeInfo.exchange && data.marketInfo.market === aggTradeInfo.marketInfo.market)
          })
          if (aggTradeInfo.price === 0 || (!aggTradeInfo.bestBidPrice || !aggTradeInfo.bestAskPrice || aggTradeInfo.bestBidPrice === 0 && aggTradeInfo.bestAskPrice === 0)) {
            return;
          }
          // console.log(state.symbolImgMap.get(aggTradeInfo.symbol))
          const data: DataType = createDataType(aggTradeInfo);
          let newDataTable = binanceDataTableRef.current.get(data.marketInfo.market) ?? [];
          if (index === undefined || index === -1) {
            newDataTable.push(data)
          } else {        
            newDataTable[index] = data;
          }
          binanceDataTableRef.current.set(data.marketInfo.market, newDataTable);
        })
        spotReady = true;
        if (spotReady === true && usdMfutureReady === true && coinMfutureReady === true) {
          setSelectedRowData();
          setIsLoading(false);
          gridRef?.current?.api?.sizeColumnsToFit();
          gridRef?.current?.api?.hideOverlay();          
        }
        return;
      }
      
      aggTradeInfos.forEach((aggTradeInfo: IAggTradeInfo) => {
        let index = binanceDataTableRef.current.get(aggTradeInfo.marketInfo.market)?.findIndex((data: DataType) => {
          return (data.coinPair === aggTradeInfo.coinPair && data.exchange === aggTradeInfo.exchange && data.marketInfo.market === aggTradeInfo.marketInfo.market)
        })
        if (aggTradeInfo.price === 0 || (!aggTradeInfo.bestBidPrice || !aggTradeInfo.bestAskPrice || aggTradeInfo.bestBidPrice === 0 && aggTradeInfo.bestAskPrice === 0)) {
          return;
        }
        // console.log(state.symbolImgMap.get(aggTradeInfo.symbol))
        const data: DataType = createDataType(aggTradeInfo);
        let preData = null;
        let newDataTable = binanceDataTableRef.current.get(data.marketInfo.market) ?? [];
        if (index === undefined || index === -1) {
          newDataTable.push(data)
        } else {        
          preData = {...newDataTable[index]}
          newDataTable[index] = data;
        }      
        binanceDataTableRef.current.set(data.marketInfo.market, newDataTable);
        if (selectedRef.current.exchange !== data.exchange || selectedRef.current.marketInfo.market !== data.marketInfo.market) {
          return;
        }
        const rowNode = gridRef?.current?.api?.getRowNode(data.id);
        if (!rowNode) { return; }
        rowNode.setData(data);          
        if (preData) {
          if (preData.price != data.price) {
            gridRef?.current?.api?.flashCells({rowNodes: [rowNode], flashDelay: 400, fadeDelay: 100,})
          }
        }
      })
    })
    wsRef.current.set(WS_TYPE.BINANCE_SPOT_TICKER, ws);


    // usd-M future market
    ws = await startWebsocket(WS_TYPE.BINANCE_USD_M_FUTURE_TICKER, codes, (aggTradeInfos: IAggTradeInfo[]) => {
      // console.log("usd-M future market aggTradeInfos: ", aggTradeInfos)
      if (aggTradeInfos?.length > 1) {
        // console.log("usd-M future market aggTradeInfos: ", aggTradeInfos)
        aggTradeInfos.forEach((aggTradeInfo: IAggTradeInfo) => {
          let index = binanceDataTableRef.current.get(aggTradeInfo.marketInfo.market)?.findIndex((data: DataType) => {
            return (data.coinPair === aggTradeInfo.coinPair && data.exchange === aggTradeInfo.exchange && data.marketInfo.market === aggTradeInfo.marketInfo.market)
          })
          if (aggTradeInfo.price === 0 || (!aggTradeInfo.bestBidPrice || !aggTradeInfo.bestAskPrice || aggTradeInfo.bestBidPrice === 0 && aggTradeInfo.bestAskPrice === 0)) {
            return;
          }
          // console.log(state.symbolImgMap.get(aggTradeInfo.symbol))
          const data: DataType = createDataType(aggTradeInfo);
          let newDataTable = binanceDataTableRef.current.get(data.marketInfo.market) ?? [];
          if (index === undefined || index === -1) {
            newDataTable.push(data)
          } else {        
            newDataTable[index] = data;
          }
          binanceDataTableRef.current.set(data.marketInfo.market, newDataTable);
        })
        usdMfutureReady = true;
        if (spotReady === true && usdMfutureReady === true && coinMfutureReady === true) {
          setSelectedRowData();
          setIsLoading(false);
          gridRef?.current?.api?.sizeColumnsToFit();
          gridRef?.current?.api?.hideOverlay();          
        }
        return;
      }
      
      aggTradeInfos.forEach((aggTradeInfo: IAggTradeInfo) => {
        let index = binanceDataTableRef.current.get(aggTradeInfo.marketInfo.market)?.findIndex((data: DataType) => {
          return (data.coinPair === aggTradeInfo.coinPair && data.exchange === aggTradeInfo.exchange && data.marketInfo.market === aggTradeInfo.marketInfo.market)
        })
        //if (aggTradeInfo.price === 0 || (!aggTradeInfo.bestBidPrice || !aggTradeInfo.bestAskPrice || aggTradeInfo.bestBidPrice === 0 && aggTradeInfo.bestAskPrice === 0)) {
        if (aggTradeInfo.price === 0) {
          return;
        }
        // console.log(state.symbolImgMap.get(aggTradeInfo.symbol))
        const data: DataType = createDataType(aggTradeInfo);
        let preData = null;
        let newDataTable = binanceDataTableRef.current.get(data.marketInfo.market) ?? [];
        if (index === undefined || index === -1) {
          newDataTable.push(data)
        } else {        
          preData = {...newDataTable[index]}
          newDataTable[index] = data;
        }      
        binanceDataTableRef.current.set(data.marketInfo.market, newDataTable);
        if (selectedRef.current.exchange !== data.exchange || selectedRef.current.marketInfo.market !== data.marketInfo.market) {
          return;
        }
        const rowNode = gridRef?.current?.api?.getRowNode(data.id);
        if (!rowNode) { return; }
        rowNode.setData(data);          
        if (preData) {
          if (preData.price != data.price) {
            gridRef?.current?.api?.flashCells({rowNodes: [rowNode], flashDelay: 400, fadeDelay: 100,})
          }
        }
      })
    })
    wsRef.current.set(WS_TYPE.BINANCE_USD_M_FUTURE_TICKER, ws);

    // coin-M future market
    ws = await startWebsocket(WS_TYPE.BINANCE_COIN_M_FUTURE_TICKER, codes, (aggTradeInfos: IAggTradeInfo[]) => {
      // console.log("coin-M future market aggTradeInfos: ", aggTradeInfos)
      if (aggTradeInfos?.length > 1) {
        aggTradeInfos.forEach((aggTradeInfo: IAggTradeInfo) => {
          let index = binanceDataTableRef.current.get(aggTradeInfo.marketInfo.market)?.findIndex((data: DataType) => {
            return (data.coinPair === aggTradeInfo.coinPair && data.exchange === aggTradeInfo.exchange && data.marketInfo.market === aggTradeInfo.marketInfo.market)
          })
          if (aggTradeInfo.price === 0 || (!aggTradeInfo.bestBidPrice || !aggTradeInfo.bestAskPrice || aggTradeInfo.bestBidPrice === 0 && aggTradeInfo.bestAskPrice === 0)) {
            return;
          }
          // console.log(state.symbolImgMap.get(aggTradeInfo.symbol))
          const data: DataType = createDataType(aggTradeInfo);
          let newDataTable = binanceDataTableRef.current.get(data.marketInfo.market) ?? [];
          if (index === undefined || index === -1) {
            newDataTable.push(data)
          } else {        
            newDataTable[index] = data;
          }
          binanceDataTableRef.current.set(data.marketInfo.market, newDataTable);
        })
        coinMfutureReady = true;
        if (spotReady === true && usdMfutureReady === true && coinMfutureReady === true) {
          setSelectedRowData();
          setIsLoading(false);
          gridRef?.current?.api?.sizeColumnsToFit();
          gridRef?.current?.api?.hideOverlay();          
        }
        return;
      }
      
      aggTradeInfos.forEach((aggTradeInfo: IAggTradeInfo) => {
        let index = binanceDataTableRef.current.get(aggTradeInfo.marketInfo.market)?.findIndex((data: DataType) => {
          return (data.coinPair === aggTradeInfo.coinPair && data.exchange === aggTradeInfo.exchange && data.marketInfo.market === aggTradeInfo.marketInfo.market)
        })
        //if (aggTradeInfo.price === 0 || (!aggTradeInfo.bestBidPrice || !aggTradeInfo.bestAskPrice || aggTradeInfo.bestBidPrice === 0 && aggTradeInfo.bestAskPrice === 0)) {
        if (aggTradeInfo.price === 0) {
          return;
        }
        // console.log(state.symbolImgMap.get(aggTradeInfo.symbol))
        const data: DataType = createDataType(aggTradeInfo);
        let preData = null;
        let newDataTable = binanceDataTableRef.current.get(data.marketInfo.market) ?? [];
        if (index === undefined || index === -1) {
          newDataTable.push(data)
        } else {        
          preData = {...newDataTable[index]}
          newDataTable[index] = data;
        }      
        binanceDataTableRef.current.set(data.marketInfo.market, newDataTable);
        if (selectedRef.current.exchange !== data.exchange || selectedRef.current.marketInfo.market !== data.marketInfo.market) {
          return;
        }
        const rowNode = gridRef?.current?.api?.getRowNode(data.id);
        if (!rowNode) { return; }
        rowNode.setData(data);          
        if (preData) {
          if (preData.price != data.price) {
            gridRef?.current?.api?.flashCells({rowNodes: [rowNode], flashDelay: 400, fadeDelay: 100,})
          }
        }
      })
    })
    wsRef.current.set(WS_TYPE.BINANCE_COIN_M_FUTURE_TICKER, ws);
  }

  const initBithumbWebSocket = async () => {    
    console.log("initBithumbWebSocket")
  }

  const initBybitWebSocket = async () => {    
    console.log("initBybitWebSocket")
  }

  const onFilterTagChanged = useCallback((tags: any) => {
    let filters: IFilterCondition[] = []
    tags?.forEach((tag: string) => {
      filters.push({
        filterType: "text",
        type: "contains",
        filter: tag
      },)
    })
    const model: IFilterModel = {
      symbol: {
        filterType: "text",
        operator: "OR",
        conditions: filters,
      }
    }
    gridRef?.current?.api?.setFilterModel(model)
    const savedModel = gridRef?.current?.api?.getFilterModel()
    // console.log("savedModel: ", savedModel)
    filterRef.current = tags;
    // const input = document.getElementById('filter-text-box') as HTMLInputElement | null;
    // if (input != null) {
    //   const value = input.value;
    //   gridRef?.current?.api?.setQuickFilter(input.value);
    // }
  }, []);

  const getRowId = useMemo(() => {
    return (params: any) => {
      // console.log(params)
      return params.data.id;
    };
  }, []);

  const changeTradingView = (exhcnage: EXCHANGE, symbol: string, marketCurrency: string) => {
    if (!exhcnage || exhcnage === EXCHANGE.NONE || !symbol || !marketCurrency || marketCurrency === MARKET_CURRENCY.NONE) return;
    if (advancedRealTimeChartPropsRef.current.symbol === `${exhcnage}:${symbol}${marketCurrency}`) return;
    advancedRealTimeChartPropsRef.current = {...advancedRealTimeChartPropsRef.current, symbol: `${exhcnage}:${symbol}${marketCurrency}`}
    setAdvancedRealTimeChartProps(advancedRealTimeChartPropsRef.current)
  }

  const onRowClicked = (event: any) => {
    console.log("onRowClicked. event: ", event)
    changeTradingView(event.data.exchange, event.data.symbol, event.data.marketInfo.marketCurrency)
  }

  const handleExchangeChange = (exchange: EXCHANGE) => {
    const marketOptions = createMarketList(exhcnageInfoMap.get(exchange) ?? [])
    if (!marketOptions[0].marketInfo) return;
    selectedRef.current = {
      exchange: exchange,
      marketInfo: _.cloneDeep(marketOptions[0].marketInfo),
    }
    setSelectedExchange(selectedRef.current.exchange);
    setSelectedMarket(selectedRef.current.marketInfo);

    initialize();
  };

  const handleMarketChange = (market: MARKET) => {
    selectedRef.current = {
      exchange: selectedRef.current.exchange,
      marketInfo: getMarketInfo(selectedRef.current.exchange, market),
    }
    setSelectedRowData();
    changeTradingView(selectedRef.current.exchange, getFirstSymbolFromExchange(selectedRef.current.exchange, selectedRef.current.marketInfo.market), selectedRef.current.marketInfo.marketCurrency)
    setSelectedMarket(selectedRef.current.marketInfo)
  };

  if (!rowData) {
    return null;
  }

  // return <></>

  return (
    <div style={{display: "flex", flex: 1, width: "100%", height: "100%", margin: 0, padding: 0}}>
      <div style={{flex: 1, height: "500px"}}>
        <AdVancedRealTimeChart option={advancedRealTimeChartProps}/>
      </div>
      <div style={{display: "flex", flexDirection: "column", width: "800px", height: "100%", marginLeft: "8px", padding: 0}} className="ag-theme-alpine">
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
          <Select
            style={{ width: 180, margin: "0px 5px" }}
            value={selectedExchange}
            bordered={true}
            onChange={handleExchangeChange}
            options={exchangeList}
          />
          <Select
            style={{ width: 180, margin: "0px 5px" }}
            value={selectedMarket.market}
            bordered={true}
            onChange={handleMarketChange}
            options={marketOptions}
          />
          <Button shape="circle" style={{backgroundColor: 'whitesmoke', margin: "0px 5px"}} icon={<SettingOutlined style={{color: "#192331", fontSize: "20px"}}/>} />
        </div>
        <div style={{flex: 1, margin: 0, padding: 0, width: "100%", height: "100%"}}>
          <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={{ sortable: true, resizable: false}}
              cacheQuickFilter={true}
              onGridReady={onGridReady}
              onComponentStateChanged={sizeColumnsToFit}
              getRowId={getRowId}
              rowHeight={50}
              rowBuffer={50}
              className='myGrid'
              loadingOverlayComponent={LoadingComp}
              onRowClicked={onRowClicked}
          />
        </div>
      </div>
    </div>
  );
};

export default CoinPriceTable;