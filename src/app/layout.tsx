

import 'antd/dist/reset.css';
import { type PropsWithChildren } from 'react'
import { Inter } from 'next/font/google';
import Providers from './components/Providers';
import RootLayout from './components/RootLayout';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'kimplab homepage',
  description: "Sharing all of the crypto curency infomation."
};

export default function Layout({ children }: PropsWithChildren) {
  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();
  
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
            <RootLayout>{children}</RootLayout>
          </Providers>
      </body>
    </html>
  )
}
