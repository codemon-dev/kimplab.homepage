'use client';

import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './coinPriceTabeStyle.css';
import { EXCHANGE, MARKET, WS_TYPE } from '@/config/enum';
import { IAggTradeInfo } from '@/config/interface';
import { removeTrailingZeros } from '../../helper/cryptoHelper';
import { coinGecko_getExchangeTickers } from '../../lib/crypto3partyAPI/coingecko/coingecko';
import { ICoinGeckoExhcnageTicker } from '../../lib/crypto3partyAPI/coingecko/ICoingecko';
import { useGlobalStore } from '@/app/hook/useGlobalStore';
import { CoinTitle } from './CoinTitle'
import useExchange from '@/app/hook/useExchange';
import Favorite from './Favorite';

interface DataType {
  id: string;
  exchange: EXCHANGE,
  market: MARKET,
  symbol: string,
  coinPair: string,
  price: number;
  change24: number;
  ochl: number[],
  marketcap: number,
  volume24: number,
  favorite: boolean,
  symbolImg: string | undefined,
}

const CoinPriceTable: React.FC = () => {
  const {state} = useGlobalStore()
  const {getInitialInfo, startWebsocket} = useExchange()

  const [rowData, setRowData] = useState<DataType[]>([]);
  const dataTableRef = useRef<DataType[]>([])
  
  const exchangeTickersMapRef = useRef<Map<EXCHANGE, ICoinGeckoExhcnageTicker>>(new Map<EXCHANGE, ICoinGeckoExhcnageTicker>())
  const wsRef = useRef<any>()

  const gridRef = useRef<any>();

  const numberCellFormatter = (params: any) => {
    return removeTrailingZeros(params.value);
  };
  
  const columnDefs: any = [
    { headerName: '이름', field: 'symbol', minWidth: 100, cellRenderer: CoinTitle, getQuickFilterText: (params: any) => { return params?.data?.symbol }},
    { headerName: '가격', field: 'price', minWidth: 100, cellClass: 'number', cellStyle: {textAlign: "end"}, valueFormatter: numberCellFormatter},
    { headerName: '변동(24H)', minWidth: 100, field: 'change24'},
    { headerName: '볼륨(24H)', field: 'volume24'},
    { headerName: '마켓갭', field: 'marketcap'},
    { headerName: '관심코인', field: 'favorite', cellRenderer: Favorite},
  ];

  const onGridReady = useCallback(() => {
    setRowData(dataTableRef.current);
    gridRef?.current?.api?.sizeColumnsToFit();
    window.onresize = () => {
      gridRef?.current?.api?.sizeColumnsToFit();
    }
  }, []);

  useEffect(() => {
    const ret = getInitialInfo().then(() => {
      coinGecko_getExchangeTickers(EXCHANGE.UPBIT).then((exchangeTickers: any) => {
        if (exchangeTickers) { exchangeTickersMapRef.current.set(exchangeTickers?.name.toLowerCase() as EXCHANGE, exchangeTickers) }
      }).then(() => {
          startWebsocket(WS_TYPE.UPBIT_TRADE, (aggTradeInfo: IAggTradeInfo) => {
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
              change24: aggTradeInfo.changeRate,
              ochl: [],
              marketcap: 0,
              volume24: 0,
              favorite: false,
              symbolImg: state.symbolImgMap.get(aggTradeInfo.symbol)?.path ?? undefined,
            }
            let preData = null;
            if (index === -1) {
              // console.log("kkkkkk: ", data)
              dataTableRef.current.push(data)
            } else {
              // console.log("gggggggg, ", data)
              preData = {...dataTableRef.current[index]}
              dataTableRef.current[index] = data;
            }
            // setDataTable(_.cloneDeep(dataTableRef.current));
            // console.log("dataTableRef.current: ", dataTableRef.current)
            // setRowData(dataTableRef.current)
            //gridRef.current?.api.setRowData(dataTableRef.current)
            const rowNode = gridRef?.current?.api?.getRowNode(data.id);
            if (rowNode) {
              // console.log(data)          
              rowNode.setData(data);          
              if (preData) {
                
                if (preData.price != data.price || preData.volume24 != data.marketcap) {
                  gridRef?.current?.api?.flashCells({rowNodes: [rowNode], flashDelay: 400, fadeDelay: 100,})
                  // gridRef?.current?.api?.flashCells({ rowNodes: [rowNode], columns: ['price'], flashDelay: 500,fadeDelay: 100,});
                  // gridRef?.current?.api?.flashCells({ rowNodes: [rowNode], columns: ['change24'], flashDelay: 500,fadeDelay: 100,});
                }
                // if (preData.volume24 != data.volume24) {
                //   gridRef?.current?.api?.flashCells({ rowNodes: [rowNode], columns: ['volume24'], flashDelay: 500,fadeDelay: 100,});
                // }
                // if (preData.volume24 != data.marketcap) {
                //   gridRef?.current?.api?.flashCells({ rowNodes: [rowNode], columns: ['marketcap'], flashDelay: 500,fadeDelay: 100,});
                // }
              }
            } else {
              const tickerInfo = exchangeTickersMapRef.current.get(EXCHANGE.UPBIT)?.tickers?.find(((obj) => {
                return (`${obj.target.toLowerCase()}-${obj.base.toLowerCase()}` === data.coinPair.toLowerCase())
              }))
              if (tickerInfo) {
                dataTableRef.current[dataTableRef.current.length - 1].volume24 = tickerInfo.volume;
              }
              setRowData([...dataTableRef.current])
            }
          }).then((ws) => {
            wsRef.current = ws;
          })
        }
      )}
    );
    return () => {
      try {
        wsRef.current?.close()
      } catch {}
    }
  }, [])

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

  return (
    <div style={{ width: '100%', height: '100%'}}>
      <div className="example-wrapper">
        <div className="example-header">
          <input
            type="text"
            id="filter-text-box"
            placeholder="Filter..."
            onInput={onFilterTextBoxChanged}
          />
        </div>
        <div style={{ height: '800px', width: '100%'}} className="ag-theme-alpine">
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
          />
        </div>  
      </div>
    </div>
  );
};

export default CoinPriceTable;