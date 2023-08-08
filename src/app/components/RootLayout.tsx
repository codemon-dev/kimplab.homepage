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
      <Layout className="layout" style={{ minHeight: "100vh", minWidth: "100vw"}}>
        {contextHolder}
        <HeaderComp />                
        <Content style={{ padding: '0px 50px', paddingTop: "20px", display: "flex", flexDirection:'column', flex: 1}}>
          <div className="site-layout-content" style={{display: "flex", flex: 1, width: "100%", height: "100%"}}>
            {children}
          </div>
        </Content>
        <FooterComp />
      </Layout>
    </div>
  ) 
}
