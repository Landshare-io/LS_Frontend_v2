import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';

import { GlobalProvider } from '../context/GlobalContext';
import { config } from '../wagmi';

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider
          modalSize="compact"
          theme={
            lightTheme({
              fontStack: "system",
              // fonts: {
              //   body: `'Inter Tight', sans-serif`,
              // },
              // colors: {
              //   closeButtonBackground: "#61cd81",
              //   connectButtonBackground: "#61cd81",
              // },
              ...lightTheme.accentColors.green,
              accentColorForeground: "white",
            })
          }
          appInfo={
            {
              appName: "Landshare",
              learnMoreUrl: "https://learnaboutcryptowallets.example",
            }
          }
        >
          <GlobalProvider>
            <Component {...pageProps} />
          </GlobalProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
