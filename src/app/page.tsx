
import React from 'react';
import { Row } from 'antd';
import CoinPriceTable from './components/CoinPriceTable/CoinPriceTable';

export default function HomePage() {
  return (    
    <div style={{flex: 1}}>
      <Row justify="center" align="middle" style={{flex: 1}}>
        <CoinPriceTable />
      </Row>
    </div>
  );
}
