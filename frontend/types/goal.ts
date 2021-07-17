import { Category } from "./category";
import { BigNumber, BigNumberish } from "ethers";

export enum Status {
    ONGOING,
    COMPLETED,
    CANCELLED,
    FAILED,
}

export interface CreateGoal {
    name: string;
    description: string;
    category: Category;
    progress: BigNumber;
    target: BigNumber;
    unit: string;
    deadline: BigNumber;
    bounty: BigNumber;
}

export type Goal = {
    name: string;
    description: string;
    category: Category;
    progress: BigNumber;
    initial: BigNumber;
    target: BigNumber;
    unit: string;
    deadline: BigNumber;
    bounty: BigNumber;
    status: Status;
    createdOn: BigNumber;
};
