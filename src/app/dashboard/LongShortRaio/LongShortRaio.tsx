"use client"

import _ from "lodash";
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useGlobalStore } from '@/app/hook/useGlobalStore';
import LongShortBar from "@/app/dashboard/LongShortRaio/LongShortBar";
import { Card } from "antd";
import './LongShortRaioStyle.css';
import { binance_usd_m_future_globalLongShortRatio } from "@/app/lib/exchange/binance/binanceCtrl";
import { ILongShortRatio } from "@/config/interface";

const supportSymbols = ["BTC", "ETH", "BCH", "ETC", "ADA", "XRP", "TRX", "DOGE", "SOL", "EOS"]

export const LongShortRaio = () => {
    const {state} = useGlobalStore();
    const longShortRatioRef = useRef<any>([])
    const [longShortRatioList, setLongShortRatioList] = useState<any[]>([])
    const isMountedRef = useRef(false)    
    const intervalRef = useRef<any>();
    
    useEffect(() => {
        if (isMountedRef.current === true) return;
        isMountedRef.current = true;
        initialize();        
        return () => {
            isMountedRef.current = false;
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
            return;
        }
    }, [])

    const initialize = () => {
        fetchLongShortRatio();
        intervalRef.current = setInterval(() => {
            fetchLongShortRatio();
        }, 10 * 60 * 1000)
    }

    const fetchLongShortRatio = useCallback(async () => {
        let promises: any = []
        supportSymbols.forEach((symbol: string) => {
            promises.push(binance_usd_m_future_globalLongShortRatio(`${symbol}USDT`));
        })
        const promiseRet = await Promise.all(promises);
        let newRatioList: any[] = []
        promiseRet.forEach((ret: ILongShortRatio) => {
            if (ret) {
                newRatioList.push(
                    <LongShortBar key={ret.symbol} symbol={ret.symbol} long={ret.long} short={ret.short} />
                )
            }
        })
        longShortRatioRef.current = [...newRatioList]
        setLongShortRatioList([...longShortRatioRef.current])
    }, [])

    return (
        <Card 
            bordered={false} title="LONG / SHORT 비율 (Binance USDⓈ-M Futures) " 
            extra={<a href="#">More</a>} 
            style={{flex: 1, display: "flex", flexDirection: "column", margin: 0, padding: 0}} 
            bodyStyle={{flex: 1, display: "flex", flexDirection: "column"}}
            headStyle={{backgroundColor: "#001529", color: "whitesmoke"}}
        >
            <div style={{flex: 1, display: "flex", flexDirection: "column", alignItems: "space-around", justifyContent: "space-around", padding: "10px 15px"}}>
                {longShortRatioList}
            </div>
        </Card>            
    );
};

export default LongShortRaio;




