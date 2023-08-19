import { removeTrailingZeros } from '@/app/helper/cryptoHelper';
import { Row, Col, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
const { Title, Text } = Typography;

export const CoinChangePrice = (props: any) => {    
    const [change, setChange] = useState<string>('');
    const [changeRate, setChangeRate] = useState<string>('');
    const [color, setColor] = useState<string>('black')    

    useEffect(() => {
        let change = props?.data?.change? props?.data?.change: props?.data?.change_24h;
        let changeRate = props?.data?.changeRate? props?.data?.changeRate: props?.data?.changeRate_24h ?? 0
        if (changeRate > 0) {
            setColor('#089981')
        } else if (changeRate < 0) {
            setColor('#f23645')
        } else {
            setColor("black")
        }
        
        setChangeRate(`${changeRate.toFixed(2)}%`)
        setChange(removeTrailingZeros(change))
    }, [props?.data?.change, props?.data?.changeRate, props?.data?.changeRate_24h, props?.data?.change_24h])
    if (!props.data) return null;

    return (
        <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-end", justifyContent: "center", height: '50px', margin: 0, padding: 0}}>
            <Title level={5} style={{color: color, margin: 0}}>{changeRate}</Title>
            <Text style={{fontSize: '14px', margin: 0, padding: 0, gap: 0}}>{change}</Text>
        </div>
    );
};

export default CoinChangePrice;