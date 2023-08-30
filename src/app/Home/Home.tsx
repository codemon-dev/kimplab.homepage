"use client"

import React, {useEffect, useState, useRef, useCallback} from 'react';
import { Col, Row, } from 'antd';import PrimiumSummary from './PrimiumSummary/PrimiumSummary';
import { TradingViewWidgetHeatMap } from '../components/TradingViewWidget/MarketcapHeatMap';
import { FearGreed } from './FearGreed/FearGreed';
import LongShortRaio from './LongShortRaio/LongShortRaio';
import './HomeStyle.css';
import MinMarketInfo from './MinMarketInfo/MinMarketInfo';
import Marketcap from './Marketcap/Marketcap';

export default function Home() {
    const isMountRef = useRef(false);

    useEffect(() => {
        if (isMountRef.current === true) return;
        isMountRef.current = true;
        return () => {
            isMountRef.current = false;
        }
    }, [])
    
    return (
        <div style={{width: "100%", height: "100%", margin: 0, padding: "8px"}}>
            <Row>
                <Col span={4} style={{backgroundColor: "gray"}}>
                    광고1
                </Col>
                <Col span={16}>
                    <Row gutter={[4, 8]} justify="center" align="top" style={{marginBottom: "8px"}}>
                        <div style={{display: "flex",  padding: "0 8px", width: "100%", height: "250px"}}>                            
                            <div style={{flex: 1, padding: 0, margin: 0, height: "100%"}}>
                                <TradingViewWidgetHeatMap />
                            </div>
                            <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: 0, margin: "0 0 0 8px", width: "180px", height: "100%"}}>
                                <MinMarketInfo />                               
                            </div>
                            <div style={{padding: 0, margin: "0 0 0 8px", width: "250px", height: "100%"}}>
                                <FearGreed />
                            </div>
                        </div>
                    </Row>    
                    <Row gutter={[4, 8]} justify="center" align="top" style={{marginBottom: "8px"}}>
                    {/* <Row gutter={[4, 8]} justify="center" align="top" style={{margin: "0 0 8px 0"}}> */}
                        <Col flex="1 1 600px">
                            <div style={{padding: "0px 4px", margin: 0, height: "100%"}}>                            
                                <PrimiumSummary />
                            </div>
                        </Col>
                        <Col flex="1 1 600px">
                            <div style={{display: "flex", flexDirection: "column", padding: "0px 4px", margin: 0, height: "442px"}}>
                                <LongShortRaio />
                            </div>
                        </Col>
                    </Row>      
                    <Row gutter={[4, 8]} justify="center" align="top" style={{marginBottom: "8px"}}>
                        <Col flex="1 1 600px">
                            <div style={{padding: "0px 4px", margin: 0, height: "485px"}}>                            
                                <Marketcap />
                            </div>
                        </Col>
                        <Col flex="1 1 600px">
                            <div style={{display: "flex", flexDirection: "column", padding: "0px 4px", margin: 0, height: "485px"}}>
                                <Marketcap />
                            </div>
                        </Col>
                    </Row> 
                </Col>
                <Col span={4} style={{backgroundColor: "gray"}}>
                    광고2
                </Col>
            </Row>
            
        </div>
    );
}
