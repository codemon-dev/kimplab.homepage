import React from 'react';
import PrimiumTable from '../components/PrimiumTable/PrimiumTable';

export default function Bot() {
  return  (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", height: 'calc(100vh - 210px)', width: "100%", margin: 0, padding: "8px"}}>
      <PrimiumTable />
    </div>
  )
}
