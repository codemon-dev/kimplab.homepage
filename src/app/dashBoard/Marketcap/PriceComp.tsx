import { removeTrailingZeros } from '@/app/helper/cryptoHelper';
import { convertKoreanCurrency } from '@/app/lib/tradeHelper';
import { Typography } from 'antd';
import React, { useState, useEffect } from 'react';
const { Title, Text } = Typography;

export const PriceComp = ({data, needToConvert}: any) => {    
    const [price, setPrice] = useState<string>('');
    const [color, setColor] = useState<string>('black')    

    useEffect(() => {
        let price = data;
        if (!price || price === 0) setPrice("-") 
        else if (needToConvert === true) setPrice(convertKoreanCurrency(price))
        else  setPrice(removeTrailingZeros(Math.round(data)))
    }, [data])

    return (
        <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-end", justifyContent: "center", margin: 0, padding: 0}}>
            <Text style={{color: color, margin: 0, fontSize: "14px"}}>{price}</Text>
        </div>
    );
};

export default PriceComp;