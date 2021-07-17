import { useEffect, useState } from "react";
import useTracker from "./use-tracker";
import { CreateGoal, Goal } from "../types/goal";

function useGoals(address: string) {
    const tracker = useTracker();
    const [goals, setGoals] = useState<Goal[]>([]);

    useEffect(() => {
        if (!address) {
            return;
        }

        tracker
            ?.getGoals(address)
            .then((results) => {
                const newGoals: Goal[] = results.map((result) => ({
                    name: result.name,
                    description: result.description,
                    category: result.category,
                    progress: result.progress,
                    initial: result.initial,
                    target: result.target,
                    unit: result.unit,
                    deadline: result.deadline,
                    bounty: result.bounty,
                    status: result.status,
                    createdOn: result.createdOn,
                }));
                setGoals(newGoals);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [address]);

    const createGoal = async (info: CreateGoal) => {
        const tx = await tracker!.createGoal(address, info.name, info.description, info.category, info.progress, info.target, info.unit, info.deadline, {
            value: info.bounty,
        });
        await tx.wait();
        const goal = await tracker!.getGoal(address, info.name);
        setGoals([...goals, goal]);
    };

    return { goals, createGoal };
}

export default useGoals;
