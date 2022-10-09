import { ethers } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { asyncCatch } from "../utils/asyncCatch";

const providerOptions = {
  /* See Provider Options Section */
};

const CHAIN_ID = "0x1";

export const Web3Context = React.createContext<null | {
  connect: () => void;
  isLoading: boolean;
  isError: boolean;
  isConnected: boolean;
  error: string;
  provider: null | ethers.providers.Web3Provider;
  signer: null | ethers.providers.JsonRpcSigner;
  address: string;
  logout: () => void;
  mint: () => void;
}>(null);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] =
    useState<null | ethers.providers.Web3Provider>(null);
  const [instance, setInstance] = useState<any>(null);
  const [signer, setSigner] = useState<null | ethers.providers.JsonRpcSigner>(
    null
  );
  const [address, setAddress] = useState("");

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsError(false);
    setError("");
    setIsConnected(false);
    setProvider(null);
    setSigner(null);
    setAddress("");
  }, []);

  const connect = async () => {
    reset();
    try {
      const web3Modal = new Web3Modal({
        network: "any", // optional
        cacheProvider: false, // optional
        providerOptions, // required
      });
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      // const balance = await provider.getBalance(address);
      // console.log(balance.toNumber() / 1000000000000000000);
      setInstance(instance);
      setAddress(address);
      setProvider(provider);
      setSigner(signer);
      setIsConnected(true);
    } catch (error) {
      setIsError(true);
      //@ts-ignore
      setError(error.message as string);
    }
    setIsLoading(false);
  };

  const mint = async () => {
    if (!signer) return;
    const contract = new ethers.Contract(
      "0xFf21994746DE8592f46fC3d7c03F7f86Ca4c69AC",
      [
        "function publicMint(uint256 count) external payable",
        "function totalSupply() public view returns (uint256) ",
      ],
      signer
    );
    const price = ethers.utils.parseUnits("0.002", "ether");
    const [err, totalSupply] = await asyncCatch(contract.totalSupply());
    //@ts-ignore
    console.log(err, totalSupply.toNumber());
    contract.publicMint(1, {
      value: price,
    });
  };

  // listen to network changes
  useEffect(() => {
    if (provider && instance) {
      // Subscribe to chainId change
      instance.on("chainChanged", (chainId: string) => {
        if (chainId !== CHAIN_ID) {
          alert("Not on main network");
          reset();
        }
      });
    }
  }, [provider, instance, reset]);

  return (
    <Web3Context.Provider
      value={{
        connect,
        isLoading,
        isError,
        error,
        isConnected,
        provider,
        signer,
        address,
        logout: reset,
        mint,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = React.useContext(Web3Context);
  if (!context) throw new Error("Must be inside Web3Provider");
  return context;
};
