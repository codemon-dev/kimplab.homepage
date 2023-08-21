'use client';
import _ from "lodash";
import useExchange from '@/app/hook/useExchange';
import { useGlobalStore } from '@/app/hook/useGlobalStore';
import { EXCHANGE, WS_TYPE } from '@/config/enum';
import { IFundingFeeInfo, IMarketInfo } from '@/config/interface';
import React, { useEffect, useRef, useState }from 'react';
import { Table } from "antd";

export const FundingFeeSummary = () => {
    const {state} = useGlobalStore()
    const isMountRef = useRef(false);
    const {startWebsocket} = useExchange()

    const selectedExchangeRef = useRef<EXCHANGE>(EXCHANGE.NONE)
    const wsRef = useRef<Map<WS_TYPE, any>>(new Map<WS_TYPE, any>())
    const binanceUsdtMfundinfFeeInfoMapRef = useRef<Map<string, IFundingFeeInfo>>(new Map()) 
    const binanceCoinMfundinfFeeInfoMapRef = useRef<Map<string, IFundingFeeInfo>>(new Map())
    const [fundingFeeTopData, setFundingFeeTopData] = useState<IFundingFeeInfo[]>([])
    const [fundingFeeBottomData, setFundingFeeBottomData] = useState<IFundingFeeInfo[]>([])

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
                binanceUsdtMfundinfFeeInfoMapRef.current.set(fundingFeeInfo.coinPair, fundingFeeInfo);
            })
            const combinedArray = Array.from(binanceUsdtMfundinfFeeInfoMapRef.current.values()).concat(Array.from(binanceCoinMfundinfFeeInfoMapRef.current.values())).sort((a, b) => b.fundingRate - a.fundingRate);
            const reverseCombinedArray = Array.from(binanceUsdtMfundinfFeeInfoMapRef.current.values()).concat(Array.from(binanceCoinMfundinfFeeInfoMapRef.current.values())).sort((a, b) => a.fundingRate - b.fundingRate);
            // console.log("combinedArray: ", combinedArray)
            // console.log("reverseCombinedArray: ", reverseCombinedArray)
            setFundingFeeTopData(_.cloneDeep(combinedArray.slice(0, 5)))
            setFundingFeeBottomData(_.cloneDeep(reverseCombinedArray.slice(0, 5)))
        })
        wsRef.current.set(WS_TYPE.BINANCE_USD_M_FUTURE_MARKET_PRICE, usdMFutureMarketPriceWs);        

        const coinMFutureMarketPriceWs = startWebsocket(WS_TYPE.BINANCE_COIN_M_FUTURE_MARKET_PRICE, codes, (fundingFeeInfos: IFundingFeeInfo[]) => {
            if (!fundingFeeInfos || fundingFeeInfos.length === 0) return;
            fundingFeeInfos.forEach((fundingFeeInfo: IFundingFeeInfo) => {
                binanceCoinMfundinfFeeInfoMapRef.current.set(fundingFeeInfo.coinPair, fundingFeeInfo);
            })
            const combinedArray = Array.from(binanceUsdtMfundinfFeeInfoMapRef.current.values()).concat(Array.from(binanceCoinMfundinfFeeInfoMapRef.current.values())).sort((a, b) => b.fundingRate - a.fundingRate);
            const reverseCombinedArray = Array.from(binanceUsdtMfundinfFeeInfoMapRef.current.values()).concat(Array.from(binanceCoinMfundinfFeeInfoMapRef.current.values())).sort((a, b) => a.fundingRate - b.fundingRate);
            // console.log("combinedArray: ", combinedArray)
            // console.log("reverseCombinedArray: ", reverseCombinedArray)
            setFundingFeeTopData(_.cloneDeep(combinedArray.slice(0, 5)))
            setFundingFeeBottomData(_.cloneDeep(reverseCombinedArray.slice(0, 5)))
        })
        wsRef.current.set(WS_TYPE.BINANCE_COIN_M_FUTURE_MARKET_PRICE, coinMFutureMarketPriceWs);
    }
    return (
        <div>
            <div>
            <p>Top</p>
            {
                
                fundingFeeTopData.map((item: IFundingFeeInfo, index: any) => (
                    <p key={index}>{item.coinPair}: {item.fundingRate}</p>
                ))
            }
            </div>
            <div>
            <p>Bottom</p>
            {
                fundingFeeBottomData.map((item: IFundingFeeInfo, index: any) => (
                    <p key={index}>{item.coinPair}: {item.fundingRate}</p>
                ))
            }
            </div>
        </div>
    )
};

export default FundingFeeSummary;