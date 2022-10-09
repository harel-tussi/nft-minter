import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Web3Provider } from "../contexts/Web3Context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3Provider>
      <Component {...pageProps} />
    </Web3Provider>
  );
}

export default MyApp;