import React from 'react';
import { Row } from 'antd';
import CoinPriceTable from '../components/CoinPriceTable/CoinPriceTable';

export default function Bot() {
  return  (
    <div style={{flex: 1}}>
      <Row justify="center" align="middle" style={{flex: 1, height: "100%", width: "100%"}}>
        <CoinPriceTable />
      </Row>
    </div>
  )
}
