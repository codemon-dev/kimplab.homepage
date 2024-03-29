import { removeTrailingZeros } from '@/app/helper/cryptoHelper';
import { Typography } from 'antd';
import React, { useState, useEffect } from 'react';
const { Text } = Typography;

export const VolumeComp = (props: any) => {    
    const [volume, setVolume] = useState<string>('');

    useEffect(() => {
        let volume = props?.data?.accTradePrice_24h ?? 0;
        if (volume >= 100) {
            setVolume(parseInt(volume).toLocaleString())
        } else {
            setVolume(removeTrailingZeros(volume))
        }
        
    }, [props?.data.accTradePrice_24, props?.data?.accTradePrice_24h])
    if (!props.data) return null;

    return (
        <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-end", justifyContent: "center", height: '50px', margin: 0, padding: 0}}>
            <Text style={{fontSize: '14px', margin: 0, padding: 0, gap: 0}}>{volume}</Text>
        </div>
    );
};

export default VolumeComp;