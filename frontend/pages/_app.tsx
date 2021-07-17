import "../styles/index.css";
import type { AppProps } from "next/app";
import WalletProvider from "../components/wallet-provider";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <WalletProvider>
            <Component {...pageProps} />
        </WalletProvider>
    );
}
export default MyApp;
