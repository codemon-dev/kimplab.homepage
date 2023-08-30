'use client'
import 'antd/dist/reset.css';
import { type PropsWithChildren } from 'react'
import { Layout, message } from 'antd';
import FooterComp from './Footer';
import { HeaderComp } from './Header';
const { Content } = Layout;

export default function RootLayout({ children }: PropsWithChildren) {
  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();
  
  const [mssageApi, contextHolder] = message.useMessage();
  return (
    <div>
      <Layout className="layout">
        {contextHolder}
        <HeaderComp />                
        <Content style={{minHeight: 'calc(100vh - 210px)', width: "100%"}}>
          {children}
        </Content>
        <FooterComp />
      </Layout>
    </div>
  ) 
}
