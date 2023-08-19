import { removeTrailingZeros } from '@/app/helper/cryptoHelper';
import { Row, Col, Typography, Space, Divider } from 'antd';
import React, { useState, useEffect } from 'react';
const { Title, Text } = Typography;

export const CoinHighLowPrice = (props: any) => {    
    const [high, setHigh] = useState<string>('');
    const [low, setLow] = useState<string>('');
    const [highColor, setHighColor] = useState<string>('black')    
    const [lowColor, setLowColor] = useState<string>('black')    
    const [highRate, setHighRate] = useState<string>('');
    const [lowRate, setLowRate] = useState<string>('');

    useEffect(() => {
        let preCloseingPrice = props?.data?.preClosingPrice;
        let high = props?.data?.high? props?.data?.high: props?.data?.high_24h;
        let low = props?.data?.low? props?.data?.low: props?.data?.low_24h;
        let price = props?.data?.price;
        let highRate = (((price / high) - 1) * 100).toFixed(2);
        let lowRate = (((price / low) - 1) * 100).toFixed(2);
        setHighRate(`${highRate}%`)
        setLowRate(`${lowRate}%`)
        if (high > preCloseingPrice) {
            setHighColor("#089981")
        } else if (high < preCloseingPrice) {
            setHighColor("#f23645")
        } else {
            setHighColor("black")
        }
        if (low > preCloseingPrice) {
            setLowColor("#089981")
        } else if (low < preCloseingPrice) {
            setLowColor("#f23645")
        } else {
            setLowColor("black")
        }
        setHigh(removeTrailingZeros(high))
        setLow(removeTrailingZeros(low))
    }, [props?.data?.high, props?.data?.high_24h, props?.data?.low, props?.data?.low_24h, props?.data?.preClosingPrice, props?.data?.price])
    if (!props.data) return null;

    return (
        <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-end", justifyContent: "center", height: '50px', margin: 0, padding: 0}}>
            <div style={{display: 'flex', flexDirection: "row", height: '25px', margin: 0, padding: 0}}>
                <Text style={{color: highColor, fontSize: '14px', margin: 0, padding: 0, gap: 0}}>{high}</Text>
                <Text style={{display: (high && low)? "block": "none", fontSize: '14px', margin: "0px 5px", padding: 0, gap: 0}}> / </Text>
                <Text style={{color: lowColor, fontSize: '14px', margin: 0, padding: 0, gap: 0}}>{low}</Text>
            </div>
            <div style={{display: 'flex', flexDirection: "row", height: '25px', margin: 0, padding: 0}}>
                <Text style={{color: "#089981", fontSize: '14px', margin: 0, padding: 0, gap: 0}}>{highRate}</Text>
                <Text style={{display: (highRate && lowRate)? "block": "none", fontSize: '14px', margin: "0px 5px", padding: 0, gap: 0}}> / </Text>
                <Text style={{color: "#f23645", fontSize: '14px', margin: 0, padding: 0, gap: 0}}>{lowRate}</Text>
            </div>
            
        </div>
    );
};

export default CoinHighLowPrice;