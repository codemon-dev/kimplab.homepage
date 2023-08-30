import { Avatar, Typography } from 'antd';
import React from 'react';
const { Title, Text } = Typography;

export const CoinTitle = ({symbol, symbolImg}: any) => {
    return (
        <div style={{display: "flex", alignItems: "center", justifyContent: "flex-start",  minWidth: "90px", height: "50px", padding: 0, margin: 0}}>
            <Avatar src={symbolImg} style={{ backgroundColor: "white", verticalAlign: 'middle'}} size="default" gap={5}>
                {symbolImg? null: symbol}
            </Avatar>
            <Title level={5} style={{margin: 0, marginLeft: 4, padding: 0, gap: 0}}>{symbol}</Title>
        </div>
    );
};

export default CoinTitle;