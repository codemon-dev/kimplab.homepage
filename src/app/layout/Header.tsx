
'use client'

import { Header } from 'antd/es/layout/layout';
import { usePathname } from 'next/navigation';
import { TickerTape } from '../components/TradingViewWidget/TickerTape';
import NavBar from '../components/NavBar';

export const HeaderComp = () => {
    const pathname = usePathname();
    return (
        <div style={{margin: 0, padding: 0, height: "110px"}}>  
            <div style={{backgroundColor: "#1e222d", margin: 0, padding: 0}}>
                <TickerTape />
            </div>
            <Header style={{ display: 'flex', alignItems: 'center'}}>                
                <NavBar />
            </Header>            
        </div>
    );
};

export default HeaderComp;