import { removeTrailingZeros } from '@/app/helper/cryptoHelper';
import { Typography } from 'antd';
import React, { useState, useEffect } from 'react';
const { Title, Text } = Typography;

export const PrimiumComp = (props: any) => {    
    const [primium, setPrimium] = useState<string>('');
    const [color, setColor] = useState<string>('black')    

    useEffect(() => {
        let primium = props?.data?.primium ?? 0;
        setColor(primium >= 0 ? '#f23645': '#089981')
        setPrimium(`${primium.toFixed(2)}%`)
    }, [props?.data?.primium])
    if (!props.data) return null;

    return (
        <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-end", justifyContent: "center", height: '50px', margin: 0, padding: 0}}>
            <Title level={5} style={{color: color, margin: 0}}>{primium}</Title>
        </div>
    );
};

export const PrimiumEnterComp = (props: any) => {    
    const [primium, setPrimium] = useState<string>('');
    const [color, setColor] = useState<string>('black')    

    useEffect(() => {
        let primium = props?.data?.primiumEnter ?? 0;
        setColor(primium >= 0 ? '#f23645': '#089981')
        setPrimium(`${primium.toFixed(2)}%`)
    }, [props?.data?.primiumEnter])
    if (!props.data) return null;

    return (
        <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-end", justifyContent: "center", height: '50px', margin: 0, padding: 0}}>
            <Text style={{color: color, margin: 0}}>{primium}</Text>
        </div>
    );
};

export const PrimiumExitComp = (props: any) => {    
    const [primium, setPrimium] = useState<string>('');
    const [color, setColor] = useState<string>('black')    

    useEffect(() => {
        let primium = props?.data?.primiumExit ?? 0;
        setColor(primium >= 0 ? '#f23645': '#089981')
        setPrimium(`${primium.toFixed(2)}%`)
    }, [props?.data?.primiumExit])
    if (!props.data) return null;

    return (
        <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-end", justifyContent: "center", height: '50px', margin: 0, padding: 0}}>
            <Text style={{color: color, margin: 0}}>{primium}</Text>
        </div>
    );
};
