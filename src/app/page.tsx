
import React from 'react';
import { Col, Row } from 'antd';
import { TradingViewWidgetHeatMap } from './components/TradingViewWidget/MarketcapHeatMap';

export default function HomePage() {
  return (
    <div style={{flex: 1}}>
      <Row justify="center" align="middle" style={{flex: 1, height: "100%", width: "100%"}}>
        <Col span={12} style={{flex: 1, height: "100%", width: "100%"}}>
          <TradingViewWidgetHeatMap />
        </Col>
        <Col span={12} style={{flex: 1, height: "100%", width: "100%"}}>
          <TradingViewWidgetHeatMap />
        </Col>
      </Row>
    </div>
  );
}
