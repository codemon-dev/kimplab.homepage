"use client"

import { EXCHANGE } from '@/config/enum';
import { Avatar, Row, Col, Typography, Table, Tabs } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useRef } from 'react';
import './PrimiumSummaryStyle.css'
import ExchangeTitle from '../ExchangeTitle';
import TabContents from './TabContents';

export const PrimiumSummary = () => {
    const isMountedRef = useRef(false)

    useEffect(() => {
        if (isMountedRef.current === true) return;
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
            return;
        }
    }, [])

    const onChange = (evt: any) => {
        console.log("onChange. evt: ", evt)
    }

    return (
        <Tabs
            tabBarGutter={0}
            tabBarStyle={{margin: 0}}
            onChange={onChange}
            type="card"
            items={new Array(50).fill(null).map((_, i) => {
                const id = String(i + 1);
                return {
                    label: `Tab ${id}`,
                    key: id,
                    children: <TabContents symbol={id} />,
                };
            })}
        />
    );
};

export default PrimiumSummary;




