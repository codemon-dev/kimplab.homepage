import { removeTrailingZeros } from '@/app/helper/cryptoHelper';
import { Col, Divider, Drawer, Row, Typography } from 'antd';
import React, { useState, useEffect, useCallback } from 'react';
const { Title } = Typography;
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";


export const CoinPriceDetail = ({open, onClose}: any) => {
    return (
        <Drawer placement="bottom" closable={false} onClose={onClose} open={open}>
            <AdvancedRealTimeChart theme="dark" autosize></AdvancedRealTimeChart>
        </Drawer>
    );
};

export default CoinPriceDetail;