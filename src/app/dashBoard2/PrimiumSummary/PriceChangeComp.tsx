import { removeTrailingZeros } from '@/app/helper/cryptoHelper';
import { Row, Col, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
const { Title, Text } = Typography;

export const PriceChangeComp = ({aggTradeInfo}: any) => {    
    const [change, setChange] = useState<string>('');
    const [changeRate, setChangeRate] = useState<string>('');
    const [color, setColor] = useState<string>('black')    

    useEffect(() => {
        let change = aggTradeInfo.change? aggTradeInfo.change: aggTradeInfo.change_24h;
        let changeRate = aggTradeInfo.changeRate? aggTradeInfo.changeRate: aggTradeInfo.changeRate_24h ?? 0
        if (changeRate > 0) setColor('#089981')
        else if (changeRate < 0) setColor('#f23645')
        else setColor("black")
        if (changeRate === 0) setChangeRate("-") 
        else setChangeRate(`${changeRate.toFixed(2)}%`)
        setChange(removeTrailingZeros(change))
    }, [aggTradeInfo.change, aggTradeInfo.changeRate, aggTradeInfo.changeRate_24h, aggTradeInfo.change_24h])

    return (
        <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-end", justifyContent: "center", margin: 0, padding: 0}}>
        {/* <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-end", justifyContent: "center", height: '50px', margin: 0, padding: 0}}> */}
            {/* <Title level={5} style={{color: color, margin: 0}}>{changeRate}</Title> */}
            <Text style={{color: color, margin: 0, fontSize: "14px"}}>{changeRate}</Text>
        </div>
    );
};

export default PriceChangeComp;