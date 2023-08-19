import { removeTrailingZeros } from '@/app/helper/cryptoHelper';
import { Typography } from 'antd';
import React, { useState, useEffect } from 'react';
const { Title, Text } = Typography;

export const PriceComp_1 = (props: any) => {    
    const [price, setPrice] = useState<string>('');
    const [color, setColor] = useState<string>('black')    

    useEffect(() => {
        let price = props?.data?.price_1 ?? 0;
        let change = props?.data?.change_1? props?.data?.change_1: props?.data?.change_24h_1 ?? 0
        // setColor(change >= 0 ? '#f23645': '#089981')
        setPrice(removeTrailingZeros(price))
    }, [props?.data?.change_1, props?.data?.change_24h_1, props?.data?.price_1])
    if (!props.data) return null;

    return (
        <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-end", justifyContent: "center", height: '50px', margin: 0, padding: 0}}>
            <Text style={{color: color, margin: 0}}>{price}</Text>
        </div>
    );
};


export const PriceComp_2= (props: any) => {    
    const [price, setPrice] = useState<string>('');
    const [color, setColor] = useState<string>('black')    

    useEffect(() => {
        let price = props?.data?.price_2 ?? 0;
        let change = props?.data?.change_2? props?.data?.change_2: props?.data?.change_24h_2 ?? 0
        // setColor(change >= 0 ? '#f23645': '#089981')
        setPrice(removeTrailingZeros(price))
    }, [props?.data?.change_2, props?.data?.change_24h_2, props?.data?.price_2])
    if (!props.data) return null;

    return (
        <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-end", justifyContent: "center", height: '50px', margin: 0, padding: 0}}>
            <Text style={{color: color, margin: 0}}>{price}</Text>
        </div>
    );
};
