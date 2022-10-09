import type { NextPage } from "next";
import { useWeb3 } from "../contexts/Web3Context";

const Home: NextPage = () => {
  const { connect, isLoading, isError, error, address, isConnected, mint } =
    useWeb3();
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!isConnected && <button onClick={connect}>Connect Wallet</button>}
      {isLoading && <p>Loading...</p>}
      {isError && <p>{error}</p>}
      {address && <p>{address}</p>}
      {isConnected && <button onClick={mint}>Mint</button>}
    </div>
  );
};

export default Home;
