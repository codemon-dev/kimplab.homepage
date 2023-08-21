
'use client'

import { Header } from 'antd/es/layout/layout';
import { usePathname } from 'next/navigation';
import NavBar from './NavBar';
import { TickerTape } from './TradingViewWidget/TickerTape';

export const HeaderComp = () => {
    const pathname = usePathname();
    return (
        <>  
            <div style={{backgroundColor: "#1e222d", margin: 0, padding: 0}}>
                <TickerTape/>
            </div>
            {/* <Header style={{ display: pathname?.includes("signin")? 'none': 'flex', alignItems: 'center' }}> */}
            <Header style={{ display: 'flex', alignItems: 'center' }}>                
                <NavBar />
            </Header>            
        </>
    );
};

export default HeaderComp;