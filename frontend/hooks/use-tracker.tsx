import { HabitTracker__factory } from "../types/ethers";
import useWallet from "./use-wallet";

const HABIT_TRACKER_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function useTracker() {
    const { provider } = useWallet();
    if (!provider) {
        return null;
    }
    const contract = HabitTracker__factory.connect(HABIT_TRACKER_ADDRESS, provider);
    return contract.connect(provider.getSigner(0));
}

export default useTracker;
