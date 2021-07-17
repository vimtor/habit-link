import { useContext } from "react";
import { WalletContext } from "../components/wallet-provider";

const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("The hook 'useWallet' must be used within WalletProvider");
    }
    return context;
};

export default useWallet;
