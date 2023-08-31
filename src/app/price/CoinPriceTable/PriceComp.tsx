import { removeTrailingZeros } from '@/app/helper/cryptoHelper';
import { Typography } from 'antd';
import React, { useState, useEffect } from 'react';
const { Title } = Typography;

export const PriceComp = (props: any) => {    
    const [price, setPrice] = useState<string>('');
    const [color, setColor] = useState<string>('black')    

    useEffect(() => {
        let price = props?.data?.price ?? 0;
        let change = props?.data?.change? props?.data?.change: props?.data?.change_24h ?? 0
        // setColor(change >= 0 ? '#089981': '#f23645')
        setPrice(removeTrailingZeros(price))
    }, [props?.data?.change, props?.data?.change_24h, props?.data?.price])
    if (!props.data) return null;

    return (
        <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-end", justifyContent: "center", height: '50px', margin: 0, padding: 0}}>
            <Title level={5} style={{color: color, margin: 0}}>{price}</Title>
        </div>
    );
};

export default PriceComp;