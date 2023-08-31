
'use client'

import { Footer } from 'antd/es/layout/layout';
import { usePathname } from 'next/navigation';
import { Typography } from 'antd';
const { Title, Text } = Typography;

export const FooterComp = () => {
    const pathname = usePathname();
    return (
        <Footer style={{display: 'block', textAlign: 'center', backgroundColor: "#001529", height: "100px"}}>
            <Text style={{color: "white"}}>kimpLab ©2023 Created by kimpLab</Text>
        </Footer>
    );
};

export default FooterComp;