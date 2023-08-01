
'use client'

import 'antd/dist/reset.css';
import { type PropsWithChildren } from 'react'
import { Inter } from 'next/font/google';
import { Layout, message } from 'antd';
import Providers from './components/Providers';
import FooterComp from './components/Footer';
import { HeaderComp } from './components/Header';
const { Content } = Layout;

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'kimplab homepage',
  description: "Sharing all of the crypto curency infomation."
};

export default function RootLayout({ children }: PropsWithChildren) {
  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();
  
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <html lang="en">
      <head>
        <title>kimpLab</title>
        <meta
          name="description"
          content="Sharing all of the crypto curency infomation."
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
          <Providers>
              <Layout className="layout" style={{ minHeight: "100vh", display: 'flex', flexDirection:'column'}}>
                {contextHolder}
                <HeaderComp />                
                <Content style={{ padding: '0px 50px', paddingTop: "20px", display: "flex", flexDirection:'column', flex: 1}}>
                  <div className="site-layout-content" style={{display: "flex", flex: 1}}>
                    {children}
                  </div>
                </Content>
                <FooterComp />
              </Layout>
          </Providers>
      </body>
    </html>
  )
}
