import { ethers } from "ethers";
import { createContext, ReactNode, useEffect, useState } from "react";

interface WalletState {
    connected: boolean;
    address: string;
    provider?: ethers.providers.Web3Provider;
    connect: () => Promise<void>;
}

export const WalletContext = createContext<WalletState>({
    connected: false,
    address: "",
    provider: undefined,
    connect: async () => {},
});

const WalletProvider = ({ children }: { children: ReactNode }) => {
    const [connected, setConnected] = useState(false);
    const [address, setAddress] = useState("");
    const [provider, setProvider] = useState<ethers.providers.Web3Provider>();

    useEffect(() => {
        // @ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

        provider.listAccounts().then((accounts) => {
            if (accounts.length > 0) {
                setConnected(true);
                setAddress(accounts[0]);
            }
        });

        // @ts-ignore
        window.ethereum.on("accountsChanged", () => {
            provider.listAccounts().then((accounts) => {
                if (accounts.length > 0) {
                    setAddress(accounts[0]);
                }
            });
        });

        // @ts-ignore
        window.ethereum.on("network", (newNetwork, oldNetwork) => {
            if (oldNetwork) {
                window.location.reload();
            }
        });

        setProvider(provider);
    }, []);

    const connect = async () => {
        const accounts = await provider?.listAccounts();
        if (accounts) {
            setConnected(true);
            setAddress(accounts[0]);
        }
    };

    const value = { connect, connected, address, provider };

    return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export default WalletProvider;
