"use client"

import _ from "lodash";
import React, {useEffect, useState, useRef, useCallback} from 'react';
import { Card, Table } from "antd";
import { useGlobalStore } from '../../hook/useGlobalStore';
import { IMarketcapInfo } from "@/config/interface";
import { ColumnsType } from "antd/es/table";
import CoinTitle from "./CoinTitle";
import "./MarketcapStyle.css"
import PriceComp from "./PriceComp";


interface DataType {
    key: string;
    marketCapInfo: IMarketcapInfo;
    timestamp: number;
}

export default function Marketcap() {
    const { state } = useGlobalStore();
    const [rawData, setRawData] = useState<DataType[]>([])
    const isMountRef = useRef(false);

    const columns: ColumnsType<DataType> = [
        {
            className: 'rank-column',
            dataIndex: 'marketCapInfo',
            align: 'center',
            render: (marketCapInfo) => <span>{marketCapInfo.rank}</span>,
        },
        {
            title: '코인',
            className: 'symbol-column',
            dataIndex: 'marketCapInfo',
            align: 'left',
            render: (marketCapInfo) => <CoinTitle symbol={marketCapInfo.symbol}/>,
        },
        {
            title: `시가 총액`,
            className: 'marketcap-column',
            dataIndex: 'marketCapInfo',            
            align: 'right',
            render: (marketCapInfo) => <PriceComp data={Math.round(marketCapInfo.marketCap / 100000000) * 100000000} needToConvert={true} />,
        },
        {
            title: '거래량(24H)',
            className: 'marketcap-column',
            dataIndex: 'marketCapInfo',
            align: 'right',
            render: (marketCapInfo) => <PriceComp data={Math.round(marketCapInfo.accTradePrice24h / 100000000) * 100000000} needToConvert={true} />,
        },
        {
            title: '발행 한도',
            className: 'supply-column',
            dataIndex: 'marketCapInfo',
            align: 'right',
            render: (marketCapInfo) => <PriceComp data={marketCapInfo.maxSupply} />,
        },
        {
            title: '총 공급량',
            className: 'supply-column',
            dataIndex: 'marketCapInfo',
            align: 'right',
            render: (marketCapInfo) => <PriceComp data={marketCapInfo.totalSupply} />,
        },
        {
            title: '순환 공급량',
            className: 'supply-column',
            dataIndex: 'marketCapInfo',
            align: 'right',
            render: (marketCapInfo) => <PriceComp data={marketCapInfo.circulatingSupply} />,
        },
    ];

    useEffect(() => {
        if (isMountRef.current === true) return;
        isMountRef.current = true;
        updateRawData();
        return () => {
            isMountRef.current = false;
        }
    }, [])

    useEffect(() => {
        updateRawData()
    }, [state.marketCapInfos])

    const updateRawData = async () => {
        if (state.marketCapInfos.length === 0) return;
        let newRawdatas: DataType[] = []
        for (const marketCapInfo of state.marketCapInfos) {            
            let data: DataType = {
                key: marketCapInfo.symbol,
                marketCapInfo: _.cloneDeep(marketCapInfo),
                timestamp: marketCapInfo.timestamp,
            }
            newRawdatas.push(data);                        
            if (newRawdatas.length === 10) break;
        }
        if (newRawdatas && newRawdatas.length > 0) {
            setRawData([...newRawdatas])
        }
    }
    const customBodyStyle = {
        padding: 0, // Remove padding
      };
    
    return (
        <Card bordered={false} title="시가 총액" extra={<a href="#">More</a>} style={{flex: 1, display: "flex", flexDirection: "column", width: "100%", height: "100%", margin: 0, padding: 0, overflow: 'auto'}}>
            <Table
                columns={columns}
                dataSource={rawData}
                bordered
                pagination={false}
                // scroll={{x: undefined, y: "auto" }} 
                size={"small"}
                style={{flex: 1, padding: 0, margin: 0}}
            />
        </Card>        

    );
}
