'use client';

import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './coinPriceTabeStyle.css';
import { EXCHANGE, MARKET, WS_TYPE } from '@/config/enum';
import { IAggTradeInfo } from '@/config/interface';
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
import { Col, Divider, Row } from 'antd';
import _ from 'lodash'

interface DataType {
  id: string;
  exchange: EXCHANGE,
  market: MARKET,
  symbol: string,
  coinPair: string,
  price: number;
  askBid: number;
  change?: number;
  change_24h?: number;
  changeRate?: number;
  changeRate_24h?: number;
  accVolume?: number,
  accVolume_24h?: number,
  accTradePrice?: number,
  accTradePrice_24h?: number,
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

const CoinPriceTable: React.FC = () => {
  const {state} = useGlobalStore()
  const advancedRealTimeChartPropsRef = useRef(defaultAdvancedRealTimeChartProps)
  const [advancedRealTimeChartProps, setAdvancedRealTimeChartProps] = useState(advancedRealTimeChartPropsRef.current)
  const {startWebsocket} = useExchange()
  const [detailOpen, setDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rowData, setRowData] = useState<DataType[]>([]);
  const selectedMarket = useRef<SelectedExchangeMarket>({exchange: EXCHANGE.UPBIT, market: MARKET.KRW})
  const wsRef = useRef<Map<EXCHANGE, any>>(new Map<EXCHANGE, any>())
  const gridRef = useRef<any>();
  const isMountRef = useRef(false)

  const upbitDataTableRef = useRef<Map<MARKET, DataType[]>>(new Map<MARKET, DataType[]>())
  const bithumbDataTableRef = useRef<Map<MARKET, DataType[]>>(new Map<MARKET, DataType[]>())
  const binanceDataTableRef = useRef<Map<MARKET, DataType[]>>(new Map<MARKET, DataType[]>())
  const bybitDataTableRef = useRef<Map<MARKET, DataType[]>>(new Map<MARKET, DataType[]>())
  
  const columnDefs: any = [
    { headerName: '이름', field: 'symbol', minWidth: 150, cellRenderer: CoinTitle, getQuickFilterText: (params: any) => { return params?.data?.symbol }},
    { headerName: '현재가격', field: 'price', minWidth: 120, headerClass: 'ag-header-right', cellRenderer: CoinPrice },
    { headerName: '가격변동', field: 'changeRate', minWidth: 100, headerClass: 'ag-header-right', cellRenderer: CoinChangePrice},    
    { headerName: '누적거래량', field: 'accTradePrice_24h', minWidth: 120, headerClass: 'ag-header-right', cellRenderer: CoinVolume},
    { headerName: '관심코인', field: 'favorite', minWidth: 100, headerClass: 'ag-header-center', cellRenderer: Favorite},
  ];

  useEffect(() => {
    if (isMountRef.current === true) {
      return;
    }
    isMountRef.current = true;
    selectedMarket.current = {exchange: EXCHANGE.UPBIT, market: MARKET.KRW};
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

  const setSelectedRowData = () => {
    if (selectedMarket.current.exchange === EXCHANGE.UPBIT) {
      console.log("selectedMarket.current.market: ", selectedMarket.current.market)
      console.log("setSelectedRowData: ", upbitDataTableRef.current.get(selectedMarket.current.market))
      setRowData([...upbitDataTableRef.current.get(selectedMarket.current.market) ?? []]);
    } else if (selectedMarket.current.exchange === EXCHANGE.BITHUMB) {
      setRowData([...bithumbDataTableRef.current.get(selectedMarket.current.market) ?? []]);
    } else if (selectedMarket.current.exchange === EXCHANGE.BINANCE) {
      setRowData([...binanceDataTableRef.current.get(selectedMarket.current.market) ?? []]);
    } else if (selectedMarket.current.exchange === EXCHANGE.BYBIT) {
      setRowData([...bybitDataTableRef.current.get(selectedMarket.current.market) ?? []]);
    }
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
      exchange: EXCHANGE.UPBIT,
      market: aggTradeInfo.market,
      symbol: aggTradeInfo.symbol,
      coinPair: aggTradeInfo.coinPair,
      price: aggTradeInfo.price,
      askBid: aggTradeInfo.askBid,
      change: aggTradeInfo.change,
      change_24h: aggTradeInfo.change_24h,
      changeRate: aggTradeInfo.changeRate,
      changeRate_24h: aggTradeInfo.changeRate_24h,
      accVolume: aggTradeInfo.accVolume,
      accVolume_24h: aggTradeInfo.accVolume_24h,
      accTradePrice: aggTradeInfo.accTradePrice,
      accTradePrice_24h: aggTradeInfo.accTradePrice_24h,
      favorite: false,
      symbolImg: state.symbolImgMap.get(aggTradeInfo.symbol)?.path ?? undefined,
    }
    return data;
  }

  const initialize = async () => {
    let promises: any = []
    promises.push(initUpbitWebSocket());
    await Promise.all(promises);
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
      
      let aggTradeInfo = aggTradeInfos[0]
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
      if (selectedMarket.current.exchange !== data.exchange || selectedMarket.current.market !== data.market) {
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
    wsRef.current.set(EXCHANGE.UPBIT, ws);
  }

  const onFilterTextBoxChanged = useCallback(() => {
    const input = document.getElementById('filter-text-box') as HTMLInputElement | null;
    if (input != null) {
      const value = input.value;
      gridRef?.current?.api?.setQuickFilter(input.value);
    }
  }, []);

  const getRowId = useMemo(() => {
    return (params: any) => {
      // console.log(params)
      return params.data.id;
    };
  }, []);

  const onRowClicked = (event: any) => {
    console.log("onRowClicked. event: ", event)
    setDetailOpen(true);
    advancedRealTimeChartPropsRef.current = {...advancedRealTimeChartPropsRef.current, symbol: `${event.data.exchange}:${event.data.symbol}${event.data.market}`}
    setAdvancedRealTimeChartProps(advancedRealTimeChartPropsRef.current)
  }

  const onDetailClose = (event: any) => {
    setDetailOpen(false);
  }

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
            <input
              type="text"
              id="filter-text-box"
              placeholder="Filter..."
              onInput={onFilterTextBoxChanged}
            />
            <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={{ sortable: true, resizable: false }}
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