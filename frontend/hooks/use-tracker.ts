import { useContext, useEffect } from "react";
import { HabitTrackerContext } from "./SymfoniContext";

function useTracker() {
    const contract = useContext(HabitTrackerContext);

    useEffect(() => {
        if (!contract.instance) {
            return;
        }
        contract.instance = contract.instance?.attach("0x5fbdb2315678afecb367f032d93f642f64180aa3");
    }, [contract.instance]);

    return contract;
}

export default useTracker;
