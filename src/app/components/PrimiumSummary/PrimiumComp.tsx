import { Typography } from 'antd';
import React, { useState, useEffect } from 'react';
const { Title, Text } = Typography;

export const PrimiumComp = ({primiumRate}: any) => {
    const [primium, setPrimium] = useState<string>('');
    const [color, setColor] = useState<string>('black')    

    useEffect(() => {
        let primium = primiumRate;
        if (primium > 0) setColor('#089981')
        else if (primium < 0) setColor('#f23645')
        else setColor("black")
        if (primium === 0) setPrimium("-") 
        else setPrimium(`${primium.toFixed(2)}%`)        
    }, [primiumRate])

    return (
        <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-end", justifyContent: "center", margin: 0, padding: 0}}>
        {/* <div style={{display: 'flex', flexDirection: "column", alignItems: "flex-end", justifyContent: "center", height: '50px', margin: 0, padding: 0}}> */}
            <Text style={{color: color, margin: 0, fontSize: "14px"}}>{primium}</Text>
        </div>
    );
};