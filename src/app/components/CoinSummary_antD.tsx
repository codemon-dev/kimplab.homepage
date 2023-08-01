"use client"
import _ from 'lodash';
import React, { useEffect, useState, useRef } from 'react';
import { Space, Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import useExchange from '../hook/useExchange';
import { EXCHANGE, MARKET, WS_TYPE } from '@/config/enum';
import { IAggTradeInfo } from '@/config/interface';

interface DataType {
  key: string;
  exchange: EXCHANGE, 
  market: MARKET,
  symbol: string,
  coinPair: string,
  price: number;
  change24: number;
  ochl: number[],
  marketcap: number,
  volume24: number,
  faviority: boolean,
}

const tableColumns: ColumnsType<DataType> = [
  {
    title: '이름',
    dataIndex: 'coinPair',
    ellipsis: true,
    fixed: true,    
    sorter: (a, b) => a.symbol > b.symbol? 1: -1,
    render: (value) => (
        <div style={{margin: "auto"}}>
            <p style={{padding: 0, margin: 0}}>{value.toLocaleString()}</p>
            {/* <p style={{padding: 0, margin: 0}}>{coinPair.toLocaleString()}</p> */}
        </div>),
  },
  {
    title: '가격',
    dataIndex: 'price',
    ellipsis: true,
    fixed: true,    
    sorter: (a, b) => a.price - b.price,
    render: (value) => (<Space size="small">{value.toLocaleString()}</Space>)
  },
  {
    title: '변동률(24시간)',
    dataIndex: 'change24',
    ellipsis: true,
    fixed: true,    
    sorter: (a, b) => a.change24 - b.change24,
    render: (value) => (<p style={{padding: 0, margin: 0, color: value >= 0? "red": "blue"}}>{value.toFixed(2)}%</p>)
    
  },
  {
    title: '마켓캡',
    dataIndex: 'marketcap',
    ellipsis: true,
    fixed: true,    
    sorter: (a, b) => a.marketcap - b.marketcap,
    render: (value) => (<Space size="small">{value.toLocaleString()}</Space>)
  },
  {
    title: '볼륨(24시간)',
    dataIndex: 'volume24',
    ellipsis: true,
    fixed: true,    
    sorter: (a, b) => a.volume24 - b.volume24,
    render: (value) => (<Space size="small">{value.toLocaleString()}</Space>),
  },
  {
    title: '관심코인',
    dataIndex: 'faviority',
    ellipsis: true,
    fixed: true,    
    sorter: (a, b) => b ? 0 : a? -1 : 1,
    render: () => (
        <Space size="small">관심</Space>
    ),
  },
];

const defaultExpandable = { expandedRowRender: (record: DataType) => <p>{record.change24}</p> };
const defaultTitle = () => 'Here is title';

const CoinSummary: React.FC = () => {
    const {getInitialInfo, startWebsocket} = useExchange()
    const [loading, setLoading] = useState(false);
    const dataTableRef = useRef<DataType[]>([])
    const [dataTable, setDataTable] = useState<DataType[]>([])
    const wsRef = useRef<any>()



    useEffect(() => {
      setInterval(() => {
        // setDataTable([...dataTableRef.current])
        // setDataTable(_.cloneDeep(dataTableRef.current))
      }, 1000);
      const ret = getInitialInfo().then(() => {
        startWebsocket(WS_TYPE.UPBIT_TRADE, (aggTradeInfo: IAggTradeInfo) => {
          // if (aggTradeInfo.symbol !== "RFR" && aggTradeInfo.symbol !== "ARK") {
          //   return;
          // }
          let index = dataTableRef.current.findIndex((data: DataType) => {
            return (data.coinPair === aggTradeInfo.coinPair && data.exchange === aggTradeInfo.exchange && data.market === aggTradeInfo.market)
          })
          const data: DataType = {
            key: `${aggTradeInfo.exchange}_${aggTradeInfo.market}_${aggTradeInfo.coinPair}`,
            exchange: EXCHANGE.UPBIT,
            market: aggTradeInfo.market,
            symbol: aggTradeInfo.symbol,
            coinPair: aggTradeInfo.coinPair,
            price: aggTradeInfo.price,
            change24: aggTradeInfo.changeRate,
            ochl: [],
            marketcap: 0,
            volume24: 0,
            faviority: false,
          }
          if (index === -1) {
            // console.log("kkkkkk: ", data)
            dataTableRef.current.push(data)
          } else {
            // console.log("gggggggg, ", data)
            dataTableRef.current[index] = data;
          }
          // setDataTable(_.cloneDeep(dataTableRef.current));
          // console.log("dataTableRef.current: ", dataTableRef.current)
          setDataTable([...dataTableRef.current])
          
        }).then((ws) => {
          wsRef.current = ws;
        })
      }
      );
      return () => {
        try {
          wsRef.current?.close()
        } catch {}
      }
    }, [])


  const handleLoadingChange = (enable: boolean) => {
    setLoading(enable);
  };

  const tableProps: TableProps<DataType> = {
    bordered: false,
    loading,
    size: "small",
    title: defaultTitle,
    showHeader: true,
    // scroll: {x: 500, y: 600},
    // tableLayout: "auto",
    pagination: false,
  };

  return (
    <>
      {/* <p>{dataTableRef.current[0].price}bbbbbb</p> */}
      <Table
        // style={{maxWidth: "90vw"}}
        {...tableProps}
        columns={tableColumns}
        dataSource={dataTable}
      />
    </>
  );
};

export default CoinSummary;