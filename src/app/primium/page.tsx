import React from 'react';
import { Row } from 'antd';
import PrimiumTable from '../components/PrimiumTable/PrimiumTable';

export default function Bot() {
  return  (
    <div style={{flex: 1}}>
      <Row justify="center" align="middle" style={{flex: 1, height: "100%", width: "100%"}}>
        <PrimiumTable />
      </Row>
    </div>
  )
}
