"use client"

import { CURRENCY_SITE_TYPE, EXCHANGE, MARKET_CURRENCY } from '@/config/enum';
import { Avatar, Row, Col, Typography, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './PrimiumSummaryStyle.css'
import { IAggTradeInfo } from '@/config/interface';
import { useGlobalStore } from '@/app/hook/useGlobalStore';
import { calculatePrimium } from '@/app/lib/tradeHelper';
import PriceComp from './PriceComp';
import { PrimiumComp } from './PrimiumComp';
import PriceChangeComp from './PriceChangeComp';
import ExchangeTitle from '@/app/components/ExchangeTitle';
import MiniChart from '@/app/components/TradingViewWidget/MiniChart';

interface DataType {
    key: string;
    exchange: EXCHANGE;
    aggTradeInfo: IAggTradeInfo;
    primium: number;
}

export interface IPrimiumTabContentsProps {
    symbol: any, 
    exchange: EXCHANGE, 
    aggTradeInfos: IAggTradeInfo[]
}

export const TabContents = ({symbol, exchange, aggTradeInfos}: IPrimiumTabContentsProps) => {
    const {state} = useGlobalStore();
    const symbolRef = useRef("BTC");
    const isMountedRef = useRef(false)
    const currencyPrice = useRef(0);
    const defaultDomesticExchange = useRef<EXCHANGE>(EXCHANGE.UPBIT)
    const aggTradeInfoMapRef = useRef<Map<EXCHANGE, IAggTradeInfo>>(new Map())
    const rawDataRef = useRef<DataType[]>([])
    const [rawData, setRawData] = useState<DataType[]>([])
    const [coinPair, setCoinPair] = useState<string>(`${symbol}KRW`)
    const [selExchange, setSelExchange] = useState<EXCHANGE>(aggTradeInfos[0].exchange)
    const intervalRef = useRef<any>()

    const columns: ColumnsType<DataType> = [
        {
            title: '거래소',
            className: 'exchange-column',
            dataIndex: 'exchange',
            align: 'left',
            render: (exchange) => <ExchangeTitle exchange={exchange} />,
        },
        {
            title: `가격`,
            className: 'price-column',
            dataIndex: 'aggTradeInfo',            
            align: 'right',
            render: (aggTradeInfo) => <PriceComp aggTradeInfo={aggTradeInfo} />,
        },
        {
            title: '변동',
            className: 'price-rate-column',
            dataIndex: 'aggTradeInfo',
            align: 'right',
            render: (aggTradeInfo) => <PriceChangeComp aggTradeInfo={aggTradeInfo} />,
        },
        {
            title: '프리미엄',
            className: 'price-rate-column',
            dataIndex: 'primium',
            align: 'right',
            render: (primium) => <PrimiumComp primiumRate={primium} />,
        },
        {
            title: '변동(1W)',
            className: 'price-rate-column',
            dataIndex: 'priceRate24h',
            align: 'right',
        },
        {
            title: '변동(1M)',
            className: 'price-rate-column',
            dataIndex: 'priceRate24h',
            align: 'right',
        },
        {
            title: '변동(1Y)',
            className: 'price-rate-column',
            dataIndex: 'priceRate24h',
            align: 'right',
        },
    ];

    useEffect(() => {
        if (isMountedRef.current === true) return;
        isMountedRef.current = true;       
        symbolRef.current = symbol;
        intervalRef.current = setInterval(()=> {
            setRawData([...rawDataRef.current])
        }, 200)
        return () => {
            isMountedRef.current = false;
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
            return;
        }
    }, [])

    useEffect(() => {
        defaultDomesticExchange.current = exchange;
        updateRawData();
    }, [exchange])

    useEffect(() => {
        aggTradeInfos?.forEach((aggTradeInfo: IAggTradeInfo) => {
            aggTradeInfoMapRef.current.set(aggTradeInfo.exchange, aggTradeInfo);
        })        
        updateRawData();
    }, [aggTradeInfos])

    useEffect(() => {
        currencyPrice.current = state.currencyInfos.get(CURRENCY_SITE_TYPE.WEBULL)?.price ?? 0;
        updateRawData();
    }, [state.currencyInfos])

    const updateRawData = () => {        
        const rawData: DataType[] = []
        let defaultAggTradeInfo = aggTradeInfoMapRef.current.get(defaultDomesticExchange.current)
        aggTradeInfoMapRef.current.forEach((value: IAggTradeInfo, key: EXCHANGE) => {
            if (!defaultAggTradeInfo) return;
            let isSameExchange = false;
            if (defaultAggTradeInfo.exchange === value.exchange) {
                isSameExchange = true;
            }
            
            let currency = 1;
            if (defaultAggTradeInfo.marketInfo.marketCurrency === MARKET_CURRENCY.KRW && value.marketInfo.marketCurrency !== MARKET_CURRENCY.KRW) {
                currency = currencyPrice.current;
            }

            let priceRate = 0;
            let priceRate24h = 0;
            let primium = 0;
            
            if (value.changeRate) priceRate = value.changeRate; 
            else if (value.changeRate_24h) priceRate24h = value.changeRate_24h;
            primium = calculatePrimium(defaultAggTradeInfo.price, value.price, currency)

            let data: DataType = {
                key: value.exchange,
                exchange: value.exchange,
                aggTradeInfo: value,
                primium: (isSameExchange || currencyPrice.current === 0)? 0: primium
            };
            rawData.push(data);                        
        })
        rawDataRef.current = [...rawData]        
    }
    

    return (
        <Table
            columns={columns}
            dataSource={rawData}
            bordered
            pagination={false}
            size={"small"}
            style={{padding: 0}}
            title={() => (
                <div style={{height: "200px", padding: 0}}>{
                    <MiniChart exchange={selExchange} coinPair={coinPair}/>
                }</div>
            )}
            onRow={(record, rowIndex) => {
                return {onClick: (event) => {
                        console.log(record.key);
                        setSelExchange(record.key as EXCHANGE);
                    }
                };
            }}
        />
    );
};

export default TabContents;