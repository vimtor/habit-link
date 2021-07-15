import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
import { Symfoni } from "../hooks/SymfoniContext";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Symfoni autoInit={true}>
            <Component {...pageProps} />
        </Symfoni>
    );
}
export default MyApp;
