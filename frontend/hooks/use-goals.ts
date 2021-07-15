import { useEffect, useState } from "react";
import useTracker from "./use-tracker";
import { BigNumber } from "ethers";

function useGoals(address: string) {
    const tracker = useTracker();
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        if (!address || !tracker.instance) {
            return;
        }

        tracker.instance
            .getGoals(address)
            .then((result) => {
                setGoals(result);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [address]);

    function createGoal({
        user,
        category = 0,
        progress = 0,
        target = 100,
        name = "running",
        description = "read one book a week",
        unit = "pages",
        deadline = Math.floor(Date.now() / 1000) + 3600,
    }) {
        tracker.instance?.createGoal(user, name, description, category, progress, target, unit, deadline, { value: BigNumber.from(10).pow(20) });
    }

    return { goals, createGoal };
}

export default useGoals;
