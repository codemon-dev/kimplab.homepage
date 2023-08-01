
'use client'

import { Header } from 'antd/es/layout/layout';
import { usePathname } from 'next/navigation';
import NavBar from './NavBar';

export const HeaderComp = () => {
    const pathname = usePathname();
    return (
        <>
            {/* <Header style={{ display: pathname?.includes("signin")? 'none': 'flex', alignItems: 'center' }}> */}
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <NavBar />
            </Header>
        </>
    );
};

export default HeaderComp;