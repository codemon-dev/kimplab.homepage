"use client"

import { EXCHANGE } from '@/config/enum';
import { Avatar, Row, Col, Typography, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useRef } from 'react';
import './PrimiumSummaryStyle.css'
import ExchangeTitle from '../ExchangeTitle';
import { MiniChart } from '../TradingViewWidget/MiniChart';
import './PrimiumSummaryStyle.css'

interface DataType {
    key: string;
    exchange: EXCHANGE;
    price: string;
    priceRate: string;
    priceRate24h: string;
    primium: string;
}
export const TabContents = (symbol: any) => {
    const isMountedRef = useRef(false)
    
    const columns: ColumnsType<DataType> = [
        {
            title: 'Exchange',
            dataIndex: 'exchange',
            render: (exchange) => <ExchangeTitle exchange={exchange} />,
        },
        {
            title: `${symbol} Price`,
            className: 'price-column',
            dataIndex: 'price',            
            align: 'right',
        },
        {
            title: 'PriceRate',
            className: 'price-rate-column',
            dataIndex: 'priceRate',
            align: 'right',
        },
        {
            title: 'PriceRate(24H)',
            className: 'price-rate-column',
            dataIndex: 'priceRate24h',
            align: 'right',
        },
        {
            title: 'Primium',
            className: 'price-rate-column',
            dataIndex: 'primium',
            align: 'right',
        },
    ];
    
    const data: DataType[] = [
        {
            key: '1',
            exchange: EXCHANGE.UPBIT,
            price: "1,234",
            priceRate: "1.24%",
            priceRate24h: "1.24%",
            primium: '0.12%',
        },
        {
            key: '2',
            exchange: EXCHANGE.BITHUMB,
            price: "1,234",
            priceRate: "1.24%",
            priceRate24h: "1.24%",
            primium: '0.12%',
        },
        {
            key: '3',
            exchange: EXCHANGE.BINANCE,
            price: "1,234",
            priceRate: "1.24%",
            priceRate24h: "1.24%",
            primium: '0.12%',
        },
        {
            key: '4',
            exchange: EXCHANGE.BYBIT,
            price: "1,234",
            priceRate: "1.24%",
            priceRate24h: "1.24%",
            primium: '0.12%',
        },
    ];

    useEffect(() => {
        if (isMountedRef.current === true) return;
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
            return;
        }
    }, [])
    return (
        <Table
            columns={columns}
            dataSource={data}
            bordered
            pagination={false}
            size={"small"}
            style={{padding: 0}}
            title={() => (
                <div style={{height: "200px", padding: 0}}>
                    <MiniChart exchange={EXCHANGE.BINANCE} coinPair="BTCUSDT"/>
                </div>
            )}
        />
    );
};

export default TabContents;