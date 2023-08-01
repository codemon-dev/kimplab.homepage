
'use client'

import { Footer } from 'antd/es/layout/layout';
import { usePathname } from 'next/navigation';

export const FooterComp = () => {
    const pathname = usePathname();
    return (
        <>
            {/* <Footer style={{display: pathname?.includes("signin_bak")? 'none': 'block', textAlign: 'center' }}>kimpLab ©2023 Created by codemong.dev</Footer> */}
            <Footer style={{display: 'block', textAlign: 'center' }}>kimpLab ©2023 Created by kimpLab</Footer>
        </>
    );
};

export default FooterComp;