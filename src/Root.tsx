/* eslint-disable global-require */
import { FC, StrictMode } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Web3ContextProvider } from "./hooks/web3Context";
import { MantineThemeOverride, MantineProvider } from '@mantine/core';

import App from "./App";
import store from "./store";
import { NotificationsProvider } from '@mantine/notifications';



const myTheme: MantineThemeOverride = {
  colorScheme: 'dark',
  primaryColor: 'brand',
  defaultRadius: 10,
  fontFamily: 'Poppins, sans-serif', 
  fontFamilyMonospace: 'Poppins, Courier, monospace',
  headings: { fontFamily: 'Poppins, sans-serif' }, 
  colors: {
    brand: ['#f3f0ff', '#e5dbff', '#d0bfff', '#b197fc', '#9775fa', '#845ef7', '#7950f2', '#7048e8', '#6741d9','#5f3dc4' ],
  },
 };



const Root: FC = () => {
   return (
      <MantineProvider theme={myTheme}  withNormalizeCSS  withGlobalStyles>
              <NotificationsProvider>

        <Web3ContextProvider>
        <Provider store={store}>
          <BrowserRouter> 
                <App /> 
           </BrowserRouter>
        </Provider>
        </Web3ContextProvider>
        </NotificationsProvider>
    </MantineProvider>
  );
};

export default Root;
