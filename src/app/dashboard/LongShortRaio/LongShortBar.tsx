"use client"

import _ from "lodash";
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useGlobalStore } from '@/app/hook/useGlobalStore';
import { Row, Col, Typography, Space, Divider } from 'antd';
import CoinTitle from "@/app/dashboard/LongShortRaio/CoinTitle";
const { Title, Text } = Typography;

export const LongShortBar = ({symbol, long, short}: any) => {
    const {state} = useGlobalStore();
    const isMountedRef = useRef(false)
    const [longRatio, setLongRatio] = useState(Math.round(long*100))
    const [shortRatio, setShortRatio] = useState(Math.round(short*100))
    
    useEffect(() => {
        if (isMountedRef.current === true) return;
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            return;
        }
    }, [])

    return (
        <div style={{display: "flex", width: "100%", height: "35px", padding: 4}}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "flex-start", margin: 0, marginRight: 8, padding: 0}}>
                <CoinTitle symbol={symbol} symbolImg={state.symbolImgMap.get(symbol)?.path}/>
            </div>
            <div style={{display: "flex", alignItems: "center", justifyContent: "flex-end",  flex: longRatio, backgroundColor: "#089981", borderTopLeftRadius:"10px", borderBottomLeftRadius:"10px"}}>
                <Text style={{fontSize: "12px", color: "white", paddingRight: "16px", margin: 0}}>LONG</Text>
                <Title level={5} style={{color: "white", paddingRight: "8px", margin: 0}}>{longRatio}%</Title>
            </div>
            <div style={{display: "flex", alignItems: "center", justifyContent: "flex-start",  flex: shortRatio, backgroundColor: "#f23645", borderTopRightRadius:"10px", borderBottomRightRadius:"10px"}}>
                <Title level={5} style={{color: "white", paddingLeft: "8px", margin: 0}}>{shortRatio}%</Title>
                <Text style={{fontSize: "12px", color: "white", paddingLeft: "16px", margin: 0}}>SHORT</Text>
            </div>
        </div>
            
    );
};

export default LongShortBar;




