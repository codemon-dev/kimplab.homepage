import { removeTrailingZeros } from '@/app/helper/cryptoHelper';
import { IAggTradeInfo } from '@/config/interface';
import { Typography } from 'antd';
import React, { useState, useEffect } from 'react';
const { Title, Text } = Typography;

export const PriceComp = ({aggTradeInfo}: any) => {    
    const [price, setPrice] = useState<string>('');
    const [color, setColor] = useState<string>('black')    

    useEffect(() => {
        let price = aggTradeInfo.price ?? 0;
        let change = aggTradeInfo.change? aggTradeInfo?.change: aggTradeInfo?.change_24h ?? 0
        // setColor(change >= 0 ? '#089981': '#f23645')
        if (price === 0) setPrice("-") 
        else setPrice(removeTrailingZeros(price))
    }, [aggTradeInfo.change, aggTradeInfo.change_24h, aggTradeInfo.price])
    if (!aggTradeInfo) return null;

    return (
        <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-end", justifyContent: "center", margin: 0, padding: 0}}>
        {/* <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-end", justifyContent: "center", height: '50px', margin: 0, padding: 0}}> */}
            <Text style={{color: color, margin: 0, fontSize: "14px"}}>{price}</Text>
        </div>
    );
};

export default PriceComp;