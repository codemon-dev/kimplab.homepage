import React from 'react';
import CoinPriceTable from './CoinPriceTable/CoinPriceTable';

export default function Price() {
  return  (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", height: 'calc(100vh - 210px)', width: "100%", margin: 0, padding: "8px"}}>
      <CoinPriceTable />
    </div>
  )
}
