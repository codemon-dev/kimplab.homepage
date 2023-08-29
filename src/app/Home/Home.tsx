"use client"

import React from 'react';
import { Col, Row } from 'antd';import PrimiumSummary from '../components/PrimiumSummary/PrimiumSummary';
import { TradingViewWidgetHeatMap } from '../components/TradingViewWidget/MarketcapHeatMap';
import { FearGreed } from '../components/FearGreed/FearGreed';
import LongShortRaio from '../components/LongShortRaio/LongShortRaio';

export default function Home() {
    return (
        <div style={{width: "100%", height: "100%", padding: 0}}>
            <Row>
                <Col span={4} style={{backgroundColor: "gray"}}>
                    광고1
                </Col>
                <Col span={16} style={{width: "100%", height: "100%"}}>
                    <Row justify="center" align="top" style={{height: "100%", width: "100%", marginBottom: 4}}>
                        <div style={{display: "flex",  padding: 0, margin: 0, width: "100%", height: "250px"}}>                            
                            <div style={{flex: 1, padding: "0px 4px", margin: 0, height: "250px"}}>
                                <TradingViewWidgetHeatMap />
                            </div>
                            <div style={{padding: "0px 4px", margin: 0, width: "250px", height: "250px"}}>
                                <FearGreed />
                            </div>
                        </div>
                    </Row>                    
                    <Row justify="center" align="top" style={{height: "100%", width: "100%"}}>
                        <div style={{display: "flex",  padding: 0, margin: 0, marginTop: 8, width: "100%", height: "100%"}}>                            
                            <div style={{flex: 1, padding: "0px 4px", margin: 0, height: "100%"}}>                            
                                <PrimiumSummary />
                            </div>
                            <div style={{flex: 1, display: "flex", flexDirection: "column", padding: "0px 4px", margin: 0}}>
                                <LongShortRaio />
                            </div>
                        </div>
                    </Row>      
                </Col>
                <Col span={4} style={{backgroundColor: "gray"}}>
                    광고2
                </Col>

            </Row>
            
        </div>
    );
}
