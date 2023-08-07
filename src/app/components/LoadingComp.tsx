import { Space, Spin } from 'antd';
import React from 'react';

export const LoadingComp = ({props}: any) => {    
    // console.log("props: ", props)
    return (
        <div style={{width:"100%", height: "100px"}}>
            <Space>
                <Spin tip="데이터 로딩" size="large">
                    <div style={{padding: "50px",  borderRadius: "4px"}} />
                </Spin>
            </Space>
        </div>
    );
};

export default LoadingComp;