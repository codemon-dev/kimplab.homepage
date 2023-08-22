"use client"

import React from 'react';
import { Col, Row } from 'antd';import PrimiumSummary from '../components/PrimiumSummary/PrimiumSummary';
import { TradingViewWidgetHeatMap } from '../components/TradingViewWidget/MarketcapHeatMap';
import { MiniChart } from '../components/TradingViewWidget/MiniChart';
import { EXCHANGE } from '@/config/enum';
import { TechnicalAnalysis } from '../components/TradingViewWidget/TechnicalAnalysis';

export default function Home() {
    return (
        <div style={{width: "100%", height: "100%"}}>
            <Row>
                <Col span={4} style={{backgroundColor: "gray"}}>
                    광고1
                </Col>
                <Col span={16} style={{width: "100%", height: "100%"}}>
                    <Row justify="center" align="middle" style={{height: "100%", width: "100%"}}>
                        <Col span={12} style={{width: "100%", height: "100%", padding: 4}}>
                            <PrimiumSummary />
                        </Col>
                        <Col span={12} style={{width: "100%", height: "100%", padding: 4}}>
                            <PrimiumSummary />
                        </Col>
                    </Row>
                    <Row justify="center" align="middle" style={{height: "100%", width: "100%"}}>
                        <Col span={12} style={{width: "100%", height: "500px", padding: 4}}>
                            <TechnicalAnalysis exchange={EXCHANGE.BINANCE} coinPair="BTCUSDT" />
                        </Col>
                        <Col span={12} style={{width: "100%", height: "500px", padding: 4}}>
                            <TradingViewWidgetHeatMap />
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
