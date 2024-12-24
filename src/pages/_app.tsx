import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import Modal from 'react-modal';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { Inter_Tight } from "next/font/google";

import { GlobalProvider } from "../context/GlobalContext";
import { StoreProvider } from "../lib/StoreProvider";
import Header from "../components/header";
import Footer from "../components/footer";
import LoadingStatus from "../components/common/loading-status";
import AlertModal from "../components/common/modals/alert";
import { config } from "../wagmi";
import { Fuul } from "@fuul/sdk";

const interTight = Inter_Tight({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: "normal",
  preload: false,
  variable: "--font-inter",
});

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {

  Fuul.init({
    apiKey: process.env.NEXT_PUBLIC_FUUL_API_KEY ?? ""
  });
  
  useEffect(() => {
    Modal.setAppElement('#__next'); // Set the root app element for accessibility
  }, []);

  return (
    <main className={`${interTight.variable} font-inter`}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={client}>
          <RainbowKitProvider
            modalSize="compact"
            theme={lightTheme({
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
            })}
            appInfo={{
              appName: "Landshare",
              learnMoreUrl: "https://learnaboutcryptowallets.example",
            }}
          >
            <GlobalProvider>
              <StoreProvider>
                <Header />
                <Component {...pageProps} />
                <Footer />
                <LoadingStatus />
                <AlertModal />
              </StoreProvider>
            </GlobalProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </main>
  );
}

export default MyApp;
