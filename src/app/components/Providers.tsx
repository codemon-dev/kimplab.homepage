"use client";

import { ConfigProvider } from "antd";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import defaultTheme from "../theme/defaultTheme";
import { StyledComponentsRegistry } from "../lib/antdStyleRegistry";
import { GlobalStoreProvider } from "../store/storeProvider";

interface Props {
  children: ReactNode;
}
function Providers({ children }: Props) {
  return (
    <StyledComponentsRegistry>        
      <GlobalStoreProvider>
          <SessionProvider>
            <ConfigProvider theme={defaultTheme}>
              {children}
            </ConfigProvider>            
          </SessionProvider>
      </GlobalStoreProvider>
    </StyledComponentsRegistry>);
}

export default Providers;