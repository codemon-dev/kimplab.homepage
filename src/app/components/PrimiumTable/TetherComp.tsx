import { removeTrailingZeros } from '@/app/helper/cryptoHelper';
import { Typography } from 'antd';
import React, { useState, useEffect } from 'react';
const { Title, Text } = Typography;

export const TetherComp = (props: any) => {    
    const [tether, setTether] = useState<string>('');
    const [color, setColor] = useState<string>('black')    

    useEffect(() => {
        let tether = props?.data?.tether ?? 0;
        setTether(removeTrailingZeros(tether, 2))
    }, [props?.data?.change_1, props?.data?.change_24h_1, props?.data?.tether])
    if (!props.data) return null;

    return (
        <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-end", justifyContent: "center", height: '50px', margin: 0, padding: 0}}>
            <Text style={{color: color, margin: 0}}>{tether}</Text>
        </div>
    );
};

export default TetherComp;