import { Avatar, Typography, Space } from 'antd';
import React from 'react';
const { Text } = Typography;

export const MenuItem = ({title, img, disabled}: any) => {    
    return (
        <Space align='center' style={{width: "100%", height: "100%"}}>
            <div style={{display: "flex", justifyContent: "flex-start", alignItems: "center", width: "100%", height: "100%"}}>
                {
                    img 
                        ? <Avatar size={18} shape="circle" src={img} />
                        : <Avatar size={18} shape="circle" style={{ backgroundColor: "orange", verticalAlign: 'middle'}}>
                            <p style={{margin: 0, padding: 0, fontSize: "16px", color: "black"}}>{title?.charAt(0)}</p>
                        </Avatar>
                }
                <Text disabled={disabled ? disabled: false} style={{margin: 0, padding: 0, gap: 0, marginLeft: "5px"}}>{title}</Text>
            </div>
        </Space>
    );
};

export default MenuItem;