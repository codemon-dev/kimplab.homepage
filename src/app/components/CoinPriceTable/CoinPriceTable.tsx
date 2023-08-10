'use client';

import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './coinPriceTabeStyle.css';
import { EXCHANGE, MARKET, WS_TYPE } from '@/config/enum';
import { IAggTradeInfo, IFilterCondition, IFilterModel } from '@/config/interface';
import { coinGecko_getExchangeTickers } from '../../lib/crypto3partyAPI/coingecko/coingecko';
import { ICoinGeckoExhcnageTicker } from '../../lib/crypto3partyAPI/coingecko/ICoingecko';
import { useGlobalStore } from '@/app/hook/useGlobalStore';
import { CoinTitle } from './CoinTitle'
import useExchange from '@/app/hook/useExchange';
import Favorite from './Favorite';
import CoinChangePrice from './CoinChangePrice';
import CoinPrice from './CoinPrice';
import CoinVolume from './CoinVolume';
import LoadingComp from '../LoadingComp';
import CoinPriceDetail from './CoinPriceDetail';
import { AdvancedRealTimeChart, AdvancedRealTimeChartProps } from "react-ts-tradingview-widgets";
import { Button, Col, Divider, Row, Select, Space } from 'antd';
import _ from 'lodash'
import CoinHighLowPrice from './CoinHighLowPrice';
import Icon, { SearchOutlined, SettingOutlined } from '@ant-design/icons';
import CustomTag from '../CustomTag';
import { ExchangeDefaultInfo } from '@/config/constants';


interface DataType {
  id: string;
  exchange: EXCHANGE,
  market: MARKET,
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

interface SelectedExchangeMarket {
  exchange: EXCHANGE,
  market: MARKET,
}

const defaultAdvancedRealTimeChartProps: AdvancedRealTimeChartProps = {
    autosize: true,
    symbol: "UPBIT:BTCKRW",
    interval: "60",
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

interface IOption {
  value: string, 
  lable: string
}

const CoinPriceTable: React.FC = () => {
  const {state} = useGlobalStore()
  const advancedRealTimeChartPropsRef = useRef(defaultAdvancedRealTimeChartProps)
  const [advancedRealTimeChartProps, setAdvancedRealTimeChartProps] = useState(advancedRealTimeChartPropsRef.current)
  const {startWebsocket} = useExchange()
  const [detailOpen, setDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rowData, setRowData] = useState<DataType[]>([]);
  // const selectedMarket = useRef<SelectedExchangeMarket>({exchange: EXCHANGE.UPBIT, market: MARKET.KRW})
  const selectedRef = useRef<SelectedExchangeMarket>({exchange: EXCHANGE.BINANCE, market: MARKET.USDT})
  const [selectedExchange, setSelectedExchange] = useState<EXCHANGE>(selectedRef.current.exchange)
  const [selectedMarket, setSelectedMarket] = useState<MARKET>(selectedRef.current.market)  
  const [marketOptions, setMarketOptions] = useState<IOption[]>([])
  const wsRef = useRef<Map<EXCHANGE, any>>(new Map<EXCHANGE, any>())
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
    { headerName: '이름', field: 'symbol', minWidth: 160, cellRenderer: CoinTitle, filter: true, suppressMenu: true, filterParams: { maxNumConditions: 50, readOnly: true }},
    { headerName: '현재가격', field: 'price', minWidth: 120, headerClass: 'ag-header-right', cellRenderer: CoinPrice },
    { headerName: '가격변동', field: 'changeRate', minWidth: 100, headerClass: 'ag-header-right', cellRenderer: CoinChangePrice},    
    { headerName: '최고/최저', field: 'highLowPrice', minWidth: 150, headerClass: 'ag-header-right', cellRenderer: CoinHighLowPrice},    
    { headerName: '누적거래량', field: 'accTradePrice_24h', minWidth: 120, headerClass: 'ag-header-right', cellRenderer: CoinVolume},
    { headerName: '', field: 'favorite', minWidth: 50, headerClass: 'ag-header-center', cellRenderer: Favorite},
  ];

  const exchangeList: IOption[] = [
    ExchangeDefaultInfo.upbit.exchange,
    ExchangeDefaultInfo.bithumb.exchange,
    ExchangeDefaultInfo.binance.exchange,
    ExchangeDefaultInfo.bybit.exchange,
  ]  

  let exhcnageInfoMap: Map<EXCHANGE, IOption[]> = new Map<EXCHANGE, IOption[]>();
  exhcnageInfoMap.set(EXCHANGE.UPBIT, ExchangeDefaultInfo.upbit.markets)
  exhcnageInfoMap.set(EXCHANGE.BITHUMB, ExchangeDefaultInfo.bithumb.markets)
  exhcnageInfoMap.set(EXCHANGE.BINANCE, ExchangeDefaultInfo.binance.markets)
  exhcnageInfoMap.set(EXCHANGE.BYBIT, ExchangeDefaultInfo.bybit.markets)

  useEffect(() => {
    if (isMountRef.current === true) {
      return;
    }
    isMountRef.current = true;
    initialize();
    return () => {
      try {
        // eslint-disable-next-line react-hooks/exhaustive-deps 
        wsRef.current.forEach((ws: any, key: EXCHANGE) => {
          console.log("close websocket. exchange: ", key);
          ws?.close()
        })
      } catch {}
      isMountRef.current = false
    }
  }, [])

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
      setRowData([...upbitDataTableRef.current.get(selectedRef.current.market) ?? []]);
      const dataTables: DataType[] = upbitDataTableRef.current.get(selectedRef.current.market) ?? []
      let options: {value: string, lable: string}[]  = []
      dataTables.forEach((data: DataType) => {
        options.push({value: data.symbol, lable: data.symbol.toUpperCase()})
      })
      filterOptionRef.current = [...options];
    } else if (selectedRef.current.exchange === EXCHANGE.BITHUMB) {
      setRowData([...bithumbDataTableRef.current.get(selectedRef.current.market) ?? []]);
      const dataTables: DataType[] = bithumbDataTableRef.current.get(selectedRef.current.market) ?? []
      let options: {value: string, lable: string}[]  = []
      dataTables.forEach((data: DataType) => {
        options.push({value: data.symbol, lable: data.symbol.toUpperCase()})
      })
      filterOptionRef.current = [...options];
    } else if (selectedRef.current.exchange === EXCHANGE.BINANCE) {
      setRowData([...binanceDataTableRef.current.get(selectedRef.current.market) ?? []]);
      const dataTables: DataType[] = binanceDataTableRef.current.get(selectedRef.current.market) ?? []
      let options: {value: string, lable: string}[]  = []
      dataTables.forEach((data: DataType) => {
        options.push({value: data.symbol, lable: data.symbol.toUpperCase()})
      })
      filterOptionRef.current = [...options];
    } else if (selectedRef.current.exchange === EXCHANGE.BYBIT) {
      setRowData([...bybitDataTableRef.current.get(selectedRef.current.market) ?? []]);
      const dataTables: DataType[] = bybitDataTableRef.current.get(selectedRef.current.market) ?? []
      let options: {value: string, lable: string}[]  = []
      dataTables.forEach((data: DataType) => {
        options.push({value: data.symbol, lable: data.symbol.toUpperCase()})
      })
      filterOptionRef.current = [...options];
    }
    setFilterOption(filterOptionRef.current)
  }

  const onGridReady = useCallback(() => {
    console.log("onGridReady");
    gridRef?.current?.api?.showLoadingOverlay();
    setSelectedRowData();
    gridRef?.current?.api?.sizeColumnsToFit();
    window.onresize = () => {
      gridRef?.current?.api?.sizeColumnsToFit();
    }
  }, []);

  const createDataType = (aggTradeInfo: IAggTradeInfo) => {
    const data: DataType = {
      id: `${aggTradeInfo.exchange}_${aggTradeInfo.market}_${aggTradeInfo.coinPair}`,
      exchange: aggTradeInfo.exchange,
      market: aggTradeInfo.market,
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

  const initialize = async () => {
    filterRef.current = [];
    //selectedMarket.current = {exchange: EXCHANGE.UPBIT, market: MARKET.KRW};
    selectedRef.current = {exchange: EXCHANGE.BINANCE, market: MARKET.USDT};
    setMarketOptions(ExchangeDefaultInfo.binance.markets)    
    let promises: any = []
    promises.push(initUpbitWebSocket());
    promises.push(initBinanceWebSocket());
    await Promise.all(promises);
  }

  const initBinanceWebSocket = async () => {    
    let codes: string[] = Array.from(state.exchangeConinInfos.get(EXCHANGE.BINANCE)?.keys() ?? []);
    const ws = await startWebsocket(WS_TYPE.BINANCE_TICKER, codes, (aggTradeInfos: IAggTradeInfo[]) => {
      // console.log("aggTradeInfos: ", aggTradeInfos)
      if (aggTradeInfos?.length > 1) {
        aggTradeInfos.forEach((aggTradeInfo: IAggTradeInfo) => {
          let index = binanceDataTableRef.current.get(aggTradeInfo.market)?.findIndex((data: DataType) => {
            return (data.coinPair === aggTradeInfo.coinPair && data.exchange === aggTradeInfo.exchange && data.market === aggTradeInfo.market)
          })
          // console.log(state.symbolImgMap.get(aggTradeInfo.symbol))
          const data: DataType = createDataType(aggTradeInfo);
          let newDataTable = binanceDataTableRef.current.get(data.market) ?? [];
          if (index === undefined || index === -1) {
            newDataTable.push(data)
          } else {        
            newDataTable[index] = data;
          }
          binanceDataTableRef.current.set(data.market, newDataTable);
        })
        setSelectedRowData();
        setIsLoading(false);
        gridRef?.current?.api?.sizeColumnsToFit();
        gridRef?.current?.api?.hideOverlay();
        return;
      }
      
      aggTradeInfos.forEach((aggTradeInfo: IAggTradeInfo) => {
        let index = binanceDataTableRef.current.get(aggTradeInfo.market)?.findIndex((data: DataType) => {
          return (data.coinPair === aggTradeInfo.coinPair && data.exchange === aggTradeInfo.exchange && data.market === aggTradeInfo.market)
        })
        console.log(state.symbolImgMap.get(aggTradeInfo.symbol))
        const data: DataType = createDataType(aggTradeInfo);
        let preData = null;
        let newDataTable = binanceDataTableRef.current.get(data.market) ?? [];
        if (index === undefined || index === -1) {
          newDataTable.push(data)
        } else {        
          preData = {...newDataTable[index]}
          newDataTable[index] = data;
        }      
        binanceDataTableRef.current.set(data.market, newDataTable);
        if (selectedRef.current.exchange !== data.exchange || selectedRef.current.market !== data.market) {
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
    wsRef.current.set(EXCHANGE.BINANCE, ws);
  }

  const initUpbitWebSocket = async () => {
  // let exchangeTickers: any = await coinGecko_getExchangeTickers(EXCHANGE.UPBIT);
    const codes: string[] = Array.from(state.exchangeConinInfos.get(EXCHANGE.UPBIT)?.keys() ?? []);
    const ws = await startWebsocket(WS_TYPE.UPBIT_TICKER, codes, (aggTradeInfos: IAggTradeInfo[]) => {
      if (aggTradeInfos?.length > 1) {
        aggTradeInfos.forEach((aggTradeInfo: IAggTradeInfo) => {
          let index = upbitDataTableRef.current.get(aggTradeInfo.market)?.findIndex((data: DataType) => {
            return (data.coinPair === aggTradeInfo.coinPair && data.exchange === aggTradeInfo.exchange && data.market === aggTradeInfo.market)
          })
          // console.log(state.symbolImgMap.get(aggTradeInfo.symbol))
          const data: DataType = createDataType(aggTradeInfo);
          let newDataTable = upbitDataTableRef.current.get(data.market) ?? [];
          if (index === undefined || index === -1) {
            newDataTable.push(data)
          } else {        
            newDataTable[index] = data;
          }
          upbitDataTableRef.current.set(data.market, newDataTable);
        })
        setSelectedRowData();
        setIsLoading(false);
        gridRef?.current?.api?.sizeColumnsToFit();
        gridRef?.current?.api?.hideOverlay();
        return;
      }
      
      aggTradeInfos.forEach((aggTradeInfo: IAggTradeInfo) => {
        let index = upbitDataTableRef.current.get(aggTradeInfo.market)?.findIndex((data: DataType) => {
          return (data.coinPair === aggTradeInfo.coinPair && data.exchange === aggTradeInfo.exchange && data.market === aggTradeInfo.market)
        })
        // console.log(state.symbolImgMap.get(aggTradeInfo.symbol))
        const data: DataType = createDataType(aggTradeInfo);
        let preData = null;
        let newDataTable = upbitDataTableRef.current.get(data.market) ?? [];
        if (index === undefined || index === -1) {
          newDataTable.push(data)
        } else {        
          preData = {...newDataTable[index]}
          newDataTable[index] = data;
        }      
        upbitDataTableRef.current.set(data.market, newDataTable);
        if (selectedRef.current.exchange !== data.exchange || selectedRef.current.market !== data.market) {
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
    wsRef.current.set(EXCHANGE.UPBIT, ws);
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

  const changeTradingView = (exhcnage: EXCHANGE, symbol: string, market: string) => {
    advancedRealTimeChartPropsRef.current = {...advancedRealTimeChartPropsRef.current, symbol: `${exhcnage}:${symbol}${market}`}
    setAdvancedRealTimeChartProps(advancedRealTimeChartPropsRef.current)
  }

  const onRowClicked = (event: any) => {
    console.log("onRowClicked. event: ", event)
    setDetailOpen(true);
    changeTradingView(event.data.exchange, event.data.symbol, event.data.market)
  }

  const onDetailClose = (event: any) => {
    setDetailOpen(false);
  }
  
  const handleExchangeChange = (exchange: EXCHANGE) => {
    const marketOptions = exhcnageInfoMap.get(exchange) ?? []
    selectedRef.current = {
      exchange: exchange,
      market: marketOptions[0].value as MARKET,
    }
    setSelectedRowData();    
    changeTradingView(selectedRef.current.exchange, getFirstSymbolFromExchange(selectedRef.current.exchange, selectedRef.current.market), selectedRef.current.market)
    setMarketOptions(marketOptions);
    setSelectedExchange(selectedRef.current.exchange);
    setSelectedMarket(selectedRef.current.market);
  };

  const handleMarketChange = (market: MARKET) => {
    selectedRef.current = {
      exchange: selectedRef.current.exchange,
      market: market
    }
    setSelectedRowData();
    changeTradingView(selectedRef.current.exchange, getFirstSymbolFromExchange(selectedRef.current.exchange, selectedRef.current.market), selectedRef.current.market)
    setSelectedMarket(selectedRef.current.market)
  };

  if (!rowData) {
    return null;
  }

  // return <></>

  return (    
    <div style={{display: "flex", flexDirection: "column", flex: 1, height: "100%", width: "100%", alignItems: "center"}}>
      {/* <div style={{flex: 1, height: "100%", minWidth: "800px"}} className="ag-theme-alpine"> */}
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
              <Select
                style={{ width: 160, margin: "0px 5px" }}
                value={selectedExchange}
                bordered={true}
                onChange={handleExchangeChange}
                options={exchangeList}
              />
              <Select
                style={{ width: 160, margin: "0px 5px" }}
                value={selectedMarket}
                bordered={true}
                onChange={handleMarketChange}
                options={marketOptions}
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
      {/* </div> */}
      {/* <CoinPriceDetail 
          title="Detail"
          open={detailOpen} 
          onClose={onDetailClose} 
          getContainer={false}/> */}
    </div>
  );
};

export default CoinPriceTable;