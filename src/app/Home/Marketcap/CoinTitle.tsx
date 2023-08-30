import { Avatar, Row, Col, Typography } from 'antd';
import React, {useState, useEffect} from 'react';
import { useGlobalStore } from '@/app/hook/useGlobalStore';
const { Title, Text } = Typography;

export const CoinTitle = ({symbol, name}: any) => {
    const {state} = useGlobalStore()
    const [title, setTitle] = useState(symbol)
    const symbolImg = state.symbolImgMap.get(symbol.toUpperCase())?.path
    
    return (
        <div style={{display: 'flex', flexDirection: "row", alignItems: "center", justifyContent: "flex-start", margin: 0, padding: 0}}>
            <Avatar src={symbolImg} style={{ backgroundColor: "white", verticalAlign: 'middle'}} size="small" gap={5}>
                {symbolImg? null: symbol}
            </Avatar>
            <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-start", justifyContent: "center", margin: 0, padding: 0, paddingLeft: 6}}>
                <Text style={{fontSize: '14px', margin: 0, padding: 0, gap: 0}}>{title}</Text>
            </div>
        </div>
    );
};

export default CoinTitle;