import { Avatar, Row, Col, Typography } from 'antd';
import React from 'react';
import { useGlobalStore } from '../hook/useGlobalStore';
const { Title, Text } = Typography;

export const ExchangeTitle = ({exchange}: any) => {
    const {state} = useGlobalStore()
    const exchangeImg = state.exchangeImgMap.get(exchange.toLowerCase())?.path
    
    return (
        <div style={{display: 'flex', flexDirection: "row", alignItems: "center", justifyContent: "flex-start", margin: 0, padding: 0}}>
            <Avatar src={exchangeImg} style={{ backgroundColor: "white", verticalAlign: 'middle'}} size="small" gap={5}>
                {exchangeImg? null: exchange}
            </Avatar>
            <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-start", justifyContent: "center", margin: 0, padding: 0, paddingLeft: 6}}>
                <Text style={{fontSize: '16px', margin: 0, padding: 0, gap: 0}}>{exchange}</Text>
            </div>
        </div>
    );
};

export default ExchangeTitle;