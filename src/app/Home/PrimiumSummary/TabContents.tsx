"use client"

import { CURRENCY_SITE_TYPE, EXCHANGE, MARKET_CURRENCY } from '@/config/enum';
import { Avatar, Row, Col, Typography, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import './PrimiumSummaryStyle.css'
import { IAggTradeInfo } from '@/config/interface';
import { useGlobalStore } from '@/app/hook/useGlobalStore';
import { calculatePrimium } from '@/app/lib/tradeHelper';
import PriceComp from '@/app/home/PrimiumSummary/PriceComp';
import { PrimiumComp } from '@/app/home/PrimiumSummary/PrimiumComp';
import PriceChangeComp from '@/app/home/PrimiumSummary/PriceChangeComp';
import ExchangeTitle from '@/app/components/ExchangeTitle';
import MiniChart from '@/app/components/TradingViewWidget/MiniChart';
import AdVancedRealTimeChart from '@/app/components/TradingViewWidget/AdVancedRealTimeChart';
import { AdvancedRealTimeChartProps } from 'react-ts-tradingview-widgets';

interface DataType {
    key: string;
    exchange: EXCHANGE;
    aggTradeInfo: IAggTradeInfo;
    primium: number;
}

export interface IPrimiumTabContentsProps {
    symbol: any, 
    defaultExchange: EXCHANGE, 
    aggTradeInfos: IAggTradeInfo[]
}

const defaultAdvancedRealTimeChartProps: AdvancedRealTimeChartProps = {
    autosize: true,
    symbol: "UPBIT:BTCKRW",
    // symbol: "NONE",
    interval: "240",
    // timezone?: Timezone;
    theme: "light",
    // style?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
    locale: "kr",    
    enable_publishing: false,
    allow_symbol_change: false,
    save_image: true,    
    show_popup_button: true,
    withdateranges: false,
    // copyrightStyles: CopyrightStyles;
}

export const TabContents = ({symbol, defaultExchange, aggTradeInfos}: IPrimiumTabContentsProps) => {
    const {state} = useGlobalStore();
    const symbolRef = useRef(symbol);
    const selectedMarketCurrency = useRef<MARKET_CURRENCY>(MARKET_CURRENCY.KRW);
    const coinPairRef = useRef<string>(`${symbol}${selectedMarketCurrency.current}`)
    const isMountedRef = useRef(false)
    const currencyPrice = useRef(0);
    const defaultOverseeExchange = useRef<EXCHANGE>(EXCHANGE.BINANCE)
    const aggTradeInfoMapRef = useRef<Map<EXCHANGE, IAggTradeInfo>>(new Map())
    const rawDataRef = useRef<DataType[]>([])
    const [rawData, setRawData] = useState<DataType[]>([])
    const intervalRef = useRef<any>()
    const chartOptionRef = useRef<AdvancedRealTimeChartProps>(defaultAdvancedRealTimeChartProps);
    const selectedExchangeRef = useRef<EXCHANGE>(EXCHANGE.UPBIT);
    const [chartOption, setChartOption] = useState<AdvancedRealTimeChartProps>(chartOptionRef.current)

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
        console.log("symbol, exchange", symbol, defaultExchange)
        if (isMountedRef.current === true) return;
        isMountedRef.current = true;       
        defaultOverseeExchange.current = defaultExchange;
        selectedExchangeRef.current = EXCHANGE.UPBIT;
        selectedMarketCurrency.current = MARKET_CURRENCY.KRW;
        // updateChartOption();
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
        // console.log("aggTradeInfos", aggTradeInfos)
        aggTradeInfos?.forEach((aggTradeInfo: IAggTradeInfo) => {
            aggTradeInfoMapRef.current.set(aggTradeInfo.exchange, aggTradeInfo);
        })        
        updateRawData();
    }, [symbol, aggTradeInfos])

    useEffect(() => {
        updateChartOption();     
    }, [symbol])

    const updateChartOption = () => {
        symbolRef.current = symbol;
        coinPairRef.current = `${symbol}${selectedMarketCurrency.current}`;
        chartOptionRef.current.symbol = `${selectedExchangeRef.current}:${coinPairRef.current}`
        setChartOption({...chartOptionRef.current})
    }

    useEffect(() => {
        currencyPrice.current = state.currencyInfos.get(CURRENCY_SITE_TYPE.WEBULL)?.price ?? 0;
        updateRawData();
    }, [state.currencyInfos])

    const updateRawData = () => {        
        const rawData: DataType[] = []
        let defaultAggTradeInfo = aggTradeInfoMapRef.current.get(defaultOverseeExchange.current)
        aggTradeInfoMapRef.current.forEach((value: IAggTradeInfo, key: EXCHANGE) => {
            if (!defaultAggTradeInfo) return;
            let isSameExchange = false;
            if (defaultAggTradeInfo.exchange === value.exchange) {
                isSameExchange = true;
            }
            
            let currency = 1;
            if (value.marketInfo.marketCurrency === MARKET_CURRENCY.KRW && defaultAggTradeInfo.marketInfo.marketCurrency !== MARKET_CURRENCY.KRW) {
                currency = currencyPrice.current;
            }

            let priceRate = 0;
            let priceRate24h = 0;
            let primium = 0;
            
            if (value.changeRate) priceRate = value.changeRate; 
            else if (value.changeRate_24h) priceRate24h = value.changeRate_24h;
            primium = calculatePrimium(value.price, defaultAggTradeInfo.price, currency)

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

    const onClickRaw = (record: any, rowIndex: any) => {
        return { onClick: (event: any) => {
                console.log(record.key);
                selectedExchangeRef.current = record.key as EXCHANGE;
                if (selectedExchangeRef.current === EXCHANGE.UPBIT || selectedExchangeRef.current === EXCHANGE.BITHUMB) {
                    selectedMarketCurrency.current = MARKET_CURRENCY.KRW
                } else {
                    selectedMarketCurrency.current = MARKET_CURRENCY.USDT
                }
                updateChartOption();
            }
        };
    }

    return (
        <Table
            columns={columns}
            dataSource={rawData}
            bordered
            pagination={false}
            size={"small"}
            style={{padding: 0, borderBottomLeftRadius: "8px"}}
            title={() => (
                <div style={{height: "200px", padding: 0}}>
                    {/* <AdVancedRealTimeChart option={chartOption}/> */}
                    <MiniChart exchange={selectedExchangeRef.current} coinPair={coinPairRef.current}/>
                </div>
            )}
            onRow={onClickRaw}
        />
    );
};

export default memo(TabContents);