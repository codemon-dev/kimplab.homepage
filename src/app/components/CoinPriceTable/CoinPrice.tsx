import { removeTrailingZeros } from '@/app/helper/cryptoHelper';
import { ASK_BID } from '@/config/enum';
import { Typography } from 'antd';
import React, { useState, useEffect } from 'react';
const { Title } = Typography;

export const CoinPrice = (props: any) => {    
    const [price, setPrice] = useState<string>('');
    const [color, setColor] = useState<string>('black')    

    useEffect(() => {
        let price = props?.data?.price ?? 0;
        setColor(props?.data?.askBid === ASK_BID.BID ? 'red': 'blue')
        setPrice(removeTrailingZeros(price))
    }, [props])
    if (!props.data) return null;

    return (
        <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-end", justifyContent: "center", height: '50px', margin: 0, padding: 0}}>
            <Title level={5} style={{color: color, margin: 0}}>{price}</Title>
        </div>
    );
};

export default CoinPrice;