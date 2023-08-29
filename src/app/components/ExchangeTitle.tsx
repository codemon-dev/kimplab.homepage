import { Avatar, Row, Col, Typography } from 'antd';
import React, {useState, useEffect} from 'react';
import { useGlobalStore } from '../hook/useGlobalStore';
import { ExchangeDefaultInfo } from '@/config/constants';
import { EXCHANGE } from '@/config/enum';
const { Title, Text } = Typography;

export const ExchangeTitle = ({exchange}: any) => {
    const {state} = useGlobalStore()
    const [title, setTitle] = useState("")
    const exchangeImg = state.exchangeImgMap.get(exchange.toLowerCase())?.path

    useEffect(()=>{
        initialize();
    }, [])

    const initialize = () => {
        if (exchange === EXCHANGE.UPBIT) setTitle(ExchangeDefaultInfo.upbit.exchange.label);
        else if (exchange === EXCHANGE.BITHUMB) setTitle(ExchangeDefaultInfo.bithumb.exchange.label);
        else if (exchange === EXCHANGE.BINANCE) setTitle(ExchangeDefaultInfo.binance.exchange.label);
        else if (exchange === EXCHANGE.BYBIT) setTitle(ExchangeDefaultInfo.bybit.exchange.label);
    }
    
    
    return (
        <div style={{display: 'flex', flexDirection: "row", alignItems: "center", justifyContent: "flex-start", margin: 0, padding: 0}}>
            <Avatar src={exchangeImg} style={{ backgroundColor: "white", verticalAlign: 'middle'}} size="small" gap={5}>
                {exchangeImg? null: exchange}
            </Avatar>
            <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-start", justifyContent: "center", margin: 0, padding: 0, paddingLeft: 6}}>
                <Text style={{fontSize: '14px', margin: 0, padding: 0, gap: 0}}>{title}</Text>
            </div>
        </div>
    );
};

export default ExchangeTitle;