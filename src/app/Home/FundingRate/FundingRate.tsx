'use client';
import _ from "lodash";
import useExchange from '@/app/hook/useExchange';
import { useGlobalStore } from '@/app/hook/useGlobalStore';
import { EXCHANGE, WS_TYPE } from '@/config/enum';
import { IFundingFeeInfo, IMarketInfo } from '@/config/interface';
import React, { useEffect, useRef, useState }from 'react';
import { Card, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import CoinTitle from "./CoinTitle";
import FundingRateComp from "./FundingRateComp";
import ExchangeTitle from "./ExchangeTitle";

const supportSymbols = ["BTC", "ETH", "BCH", "ETC", "ADA", "XRP", "TRX", "DOGE", "SOL", "EOS"]

interface DataType {
    key: string;
    fundingFeeInfo_Binance_USDTM: IFundingFeeInfo | undefined;
    fundingFeeInfo_Binance_COINM: IFundingFeeInfo | undefined;
    fundingFeeInfo_BYBIT: IFundingFeeInfo | undefined;
}

export const FundingRate = () => {
    const {state} = useGlobalStore()
    const isMountRef = useRef(false);
    const {startWebsocket} = useExchange()    

    const selectedExchangeRef = useRef<EXCHANGE>(EXCHANGE.NONE)
    const wsRef = useRef<Map<WS_TYPE, any>>(new Map<WS_TYPE, any>())

    const binanceUsdtMfundinfFeeInfoMapRef = useRef<Map<string, IFundingFeeInfo>>(new Map()) 
    const binanceCoinMfundinfFeeInfoMapRef = useRef<Map<string, IFundingFeeInfo>>(new Map())    
    const [rawData, setRawData] = useState<DataType[]>([])

    const columns: ColumnsType<DataType> = [
        {
            title: '코인',
            className: 'symbol-column',
            dataIndex: 'key',
            align: 'left',
            render: (key) => <CoinTitle symbol={key}/>,
        },
        {
            title: <ExchangeTitle exchange={EXCHANGE.BINANCE} postfix={`USDⓈ-M`}/>,
            className: 'funding-rate-column',
            dataIndex: 'fundingFeeInfo_Binance_USDTM',            
            align: 'right',
            render: (fundingFeeInfo_Binance_USDTM) => <FundingRateComp fundingFeeInfo={fundingFeeInfo_Binance_USDTM} />,
        },
        {
            title: <ExchangeTitle exchange={EXCHANGE.BINANCE} postfix={`COIN-M`}/>,
            className: 'funding-rate-column',
            dataIndex: 'fundingFeeInfo_Binance_COINM',            
            align: 'right',
            render: (fundingFeeInfo_Binance_COINM) => <FundingRateComp fundingFeeInfo={fundingFeeInfo_Binance_COINM} />,
        },
        {
            title: <ExchangeTitle exchange={EXCHANGE.BYBIT} postfix={"Perpetual"}/>,
            className: 'funding-rate-column',
            dataIndex: 'fundingFeeInfo_BYBIT',            
            align: 'right',
            render: (fundingFeeInfo_BYBIT) => <FundingRateComp fundingFeeInfo={fundingFeeInfo_BYBIT} />,
        },
    ];

    useEffect(() => {
        if (isMountRef.current === true) {return}
        isMountRef.current = true;
        selectedExchangeRef.current = EXCHANGE.BINANCE;
        initialize()
        return () => {
            closeAllWs();
            isMountRef.current = false;
        }
    }, [])

    const closeAllWs = () => {
        try {
            // eslint-disable-next-line react-hooks/exhaustive-deps 
            wsRef.current.forEach((ws: any, key: WS_TYPE) => {
            console.log("close websocket. key: ", key);
            ws?.close()
            })
        } catch {}
    }

    const initialize = async () => {        
        closeAllWs()
        initailzeBinance();
    }

    const initailzeBinance = () => {
        let codes: string[] = Array.from(state.exchangeConinInfos.get(EXCHANGE.BINANCE)?.keys() ?? []);
        const usdMFutureMarketPriceWs = startWebsocket(WS_TYPE.BINANCE_USD_M_FUTURE_MARKET_PRICE, codes, (fundingFeeInfos: IFundingFeeInfo[]) => {
            if (!fundingFeeInfos || fundingFeeInfos.length === 0) return;
            fundingFeeInfos.forEach((fundingFeeInfo: IFundingFeeInfo) => {
                if (supportSymbols.includes(fundingFeeInfo.symbol) === false) return;
                binanceUsdtMfundinfFeeInfoMapRef.current.set(fundingFeeInfo.coinPair, fundingFeeInfo);
            })
            updateRawData();
        })
        wsRef.current.set(WS_TYPE.BINANCE_USD_M_FUTURE_MARKET_PRICE, usdMFutureMarketPriceWs);        

        const coinMFutureMarketPriceWs = startWebsocket(WS_TYPE.BINANCE_COIN_M_FUTURE_MARKET_PRICE, codes, (fundingFeeInfos: IFundingFeeInfo[]) => {
            if (!fundingFeeInfos || fundingFeeInfos.length === 0) return;
            fundingFeeInfos.forEach((fundingFeeInfo: IFundingFeeInfo) => {
                if (supportSymbols.includes(fundingFeeInfo.symbol) === false) return;
                binanceCoinMfundinfFeeInfoMapRef.current.set(fundingFeeInfo.coinPair, fundingFeeInfo);
            })
            updateRawData();
        })
        wsRef.current.set(WS_TYPE.BINANCE_COIN_M_FUTURE_MARKET_PRICE, coinMFutureMarketPriceWs);
    }

    const updateRawData = () => {
        const newRawData: DataType[] = supportSymbols.map((symbol: string) => {
            let dataType: DataType = {
                key: symbol,
                fundingFeeInfo_Binance_USDTM: undefined,
                fundingFeeInfo_Binance_COINM: undefined,
                fundingFeeInfo_BYBIT: undefined,
            }
            let coinPair = `${symbol}USDT`
            let fundingFeeInfo = binanceUsdtMfundinfFeeInfoMapRef.current.get(coinPair)
            if (fundingFeeInfo) dataType.fundingFeeInfo_Binance_USDTM = fundingFeeInfo;

            coinPair = `${symbol}USD`
            fundingFeeInfo = binanceCoinMfundinfFeeInfoMapRef.current.get(coinPair)
            if (fundingFeeInfo) dataType.fundingFeeInfo_Binance_COINM = fundingFeeInfo;
            return dataType;
        })
        setRawData(_.cloneDeep(newRawData));
        console.log(newRawData);
    }

    return (
        <Card
            bordered={false} 
            title="Funding Rate" 
            extra={<a href="#">More</a>} 
            style={{flex: 1, display: "flex", flexDirection: "column", width: "100%", height: "100%", margin: 0, padding: 0}}
            headStyle={{backgroundColor: "#001529", color: "whitesmoke", margin: 0}}
        >
            <Table
                columns={columns}
                dataSource={rawData}
                bordered
                pagination={false}
                size={"small"}
                style={{flex: 1, padding: 0, margin: 0}}
            />
        </Card>
    )
};

export default FundingRate;