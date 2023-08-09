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
  ochl: number[],
  accVolume?: number,
  accVolume_24h?: number,
  accTradePrice?: number,
  accTradePrice_24h?: number,
  favorite: boolean,
  symbolImg: string | undefined,
}

// AdvancedRealTimeChartProps = {
//   width?: number | string;
//   height?: number | string;
//   autosize?: boolean;
//   symbol?: string;
//   interval?: "1" | "3" | "5" | "15" | "30" | "60" | "120" | "180" | "240" | "D" | "W";
//   range?: "1D" | "5D" | "1M" | "3M" | "6M" | "YTD" | "12M" | "60M" | "ALL";
//   timezone?: Timezone;
//   theme?: ColorTheme;
//   style?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
//   locale?: Locales | "hu_HU" | "fa_IR";
//   toolbar_bg?: string;
//   enable_publishing?: boolean;
//   withdateranges?: boolean;
//   hide_top_toolbar?: boolean;
//   hide_legend?: boolean;
//   hide_side_toolbar?: boolean;
//   allow_symbol_change?: boolean;
//   save_image?: boolean;
//   details?: boolean;
//   hotlist?: boolean;
//   calendar?: boolean;
//   show_popup_button?: boolean;
//   popup_width?: string;
//   popup_height?: string;
//   watchlist?: string[];
//   studies?: Studies[];
//   disabled_features?: WidgetFeatures[];
//   enabled_features?: WidgetFeatures[];
//   container_id?: string;
//   children?: never;
//   copyrightStyles?: CopyrightStyles;
// };

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
  const {getInitialInfo, startWebsocket} = useExchange()
  const [detailOpen, setDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rowData, setRowData] = useState<DataType[]>([]);
  const selelectedExchangeRef = useRef<EXCHANGE>(EXCHANGE.UPBIT)
  const dataTableRef = useRef<DataType[]>([])  
  const wsRef = useRef<Map<EXCHANGE, any>>(new Map<EXCHANGE, any>())
  const gridRef = useRef<any>();
  const isMountRef = useRef(false)
  
  const columnDefs: any = [
    { headerName: '이름', field: 'symbol', minWidth: 150, cellRenderer: CoinTitle, getQuickFilterText: (params: any) => { return params?.data?.symbol }},
    { headerName: '현재가격', field: 'price', minWidth: 120, headerClass: 'ag-header-right', cellRenderer: CoinPrice },
    { headerName: '가격변동', field: 'changeRate', minWidth: 100, headerClass: 'ag-header-right', cellRenderer: CoinChangePrice},    
    { headerName: '누적거래량', field: 'accTradePrice_24h', minWidth: 120, headerClass: 'ag-header-right', cellRenderer: CoinVolume},
    { headerName: '관심코인', field: 'favorite', minWidth: 100, headerClass: 'ag-header-center', cellRenderer: Favorite},
  ];

  const onGridReady = useCallback(() => {
    gridRef?.current?.api?.showLoadingOverlay();
    setRowData(dataTableRef.current);
    gridRef?.current?.api?.sizeColumnsToFit();
    window.onresize = () => {
      gridRef?.current?.api?.sizeColumnsToFit();
    }
  }, []);

  useEffect(() => {
    if (isMountRef.current === true) {
      return;
    }
    isMountRef.current = true;
    initialize();
    return () => {
      try {
        wsRef.current.forEach((ws: any, key: EXCHANGE) => {
          console.log("close websocket. exchange: ", key);
          ws?.close()
        })        
      } catch {}
      isMountRef.current = false
    }
  }, [])

  const initialize = async () => {
    await getInitialInfo();
    let exchangeTickers: any = await coinGecko_getExchangeTickers(EXCHANGE.UPBIT);
    const ws = await startWebsocket(WS_TYPE.UPBIT_TICKER, (aggTradeInfo: IAggTradeInfo) => {
      let index = dataTableRef.current.findIndex((data: DataType) => {
        return (data.coinPair === aggTradeInfo.coinPair && data.exchange === aggTradeInfo.exchange && data.market === aggTradeInfo.market)
      })
      // console.log(state.symbolImgMap.get(aggTradeInfo.symbol))
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
        ochl: [],
        accVolume: aggTradeInfo.accVolume,
        accVolume_24h: aggTradeInfo.accVolume_24h,
        accTradePrice: aggTradeInfo.accTradePrice,
        accTradePrice_24h: aggTradeInfo.accTradePrice_24h,
        favorite: false,
        symbolImg: state.symbolImgMap.get(aggTradeInfo.symbol)?.path ?? undefined,
      }
      let preData = null;
      if (index === -1) {
        dataTableRef.current.push(data)
      } else {        
        preData = {...dataTableRef.current[index]}
        dataTableRef.current[index] = data;
      }
      const rowNode = gridRef?.current?.api?.getRowNode(data.id);
      if (rowNode) {        
        rowNode.setData(data);          
        if (preData) {
          if (preData.price != data.price) {
            gridRef?.current?.api?.flashCells({rowNodes: [rowNode], flashDelay: 400, fadeDelay: 100,})
          }
        }
      } else {
        setRowData([...dataTableRef.current])
      }
      setIsLoading(false);
      gridRef?.current?.api?.sizeColumnsToFit();
      gridRef?.current?.api?.hideOverlay();
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
    advancedRealTimeChartPropsRef.current = {...advancedRealTimeChartPropsRef.current, symbol: `${event.data.exchange.toUpperCase()}:${event.data.symbol}${event.data.market}`}
    setAdvancedRealTimeChartProps(advancedRealTimeChartPropsRef.current)
  }

  const onDetailClose = (event: any) => {
    setDetailOpen(false);
  }

  if (!rowData) {
    return null;
  }

//   const defaultAdvancedRealTimeChartProps: AdvancedRealTimeChartProps = {
//     autosize: true,
//     // symbol?: string;
//     interval: "60",
//     // timezone?: Timezone;
//     theme: "light",
//     // style?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
//     locale: "kr",    
//     enable_publishing: true,
//     allow_symbol_change: false,
//     save_image: true,    
//     show_popup_button: true,    
//     // copyrightStyles: CopyrightStyles;
// } 

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