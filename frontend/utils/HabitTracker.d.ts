/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers, EventFilter, Signer, BigNumber, BigNumberish, PopulatedTransaction } from "ethers";
import { Contract, ContractTransaction, Overrides, PayableOverrides, CallOverrides } from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface HabitTrackerInterface extends ethers.utils.Interface {
    functions: {
        "addProgress(address,string,uint256)": FunctionFragment;
        "cancelGoal(address,string)": FunctionFragment;
        "company()": FunctionFragment;
        "completeGoal(address,string)": FunctionFragment;
        "createGoal(address,string,string,uint8,uint256,uint256,string,uint256)": FunctionFragment;
        "failGoal(address,string)": FunctionFragment;
        "getGoal(address,string)": FunctionFragment;
        "getGoals(address)": FunctionFragment;
        "goals(address,string)": FunctionFragment;
    };

    encodeFunctionData(functionFragment: "addProgress", values: [string, string, BigNumberish]): string;
    encodeFunctionData(functionFragment: "cancelGoal", values: [string, string]): string;
    encodeFunctionData(functionFragment: "company", values?: undefined): string;
    encodeFunctionData(functionFragment: "completeGoal", values: [string, string]): string;
    encodeFunctionData(
        functionFragment: "createGoal",
        values: [string, string, string, BigNumberish, BigNumberish, BigNumberish, string, BigNumberish]
    ): string;
    encodeFunctionData(functionFragment: "failGoal", values: [string, string]): string;
    encodeFunctionData(functionFragment: "getGoal", values: [string, string]): string;
    encodeFunctionData(functionFragment: "getGoals", values: [string]): string;
    encodeFunctionData(functionFragment: "goals", values: [string, string]): string;

    decodeFunctionResult(functionFragment: "addProgress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "cancelGoal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "company", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "completeGoal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "createGoal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "failGoal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getGoal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getGoals", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "goals", data: BytesLike): Result;

    events: {
        "GoalCancelled(address,string)": EventFragment;
        "GoalCompleted(address,string)": EventFragment;
        "GoalFailed(address,string)": EventFragment;
        "GoalStarted(address,string)": EventFragment;
    };

    getEvent(nameOrSignatureOrTopic: "GoalCancelled"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "GoalCompleted"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "GoalFailed"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "GoalStarted"): EventFragment;
}

export class HabitTracker extends Contract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;

    on(event: EventFilter | string, listener: Listener): this;
    once(event: EventFilter | string, listener: Listener): this;
    addListener(eventName: EventFilter | string, listener: Listener): this;
    removeAllListeners(eventName: EventFilter | string): this;
    removeListener(eventName: any, listener: Listener): this;

    interface: HabitTrackerInterface;

    functions: {
        addProgress(_user: string, _name: string, _value: BigNumberish, overrides?: Overrides): Promise<ContractTransaction>;

        "addProgress(address,string,uint256)"(_user: string, _name: string, _value: BigNumberish, overrides?: Overrides): Promise<ContractTransaction>;

        cancelGoal(_user: string, _name: string, overrides?: Overrides): Promise<ContractTransaction>;

        "cancelGoal(address,string)"(_user: string, _name: string, overrides?: Overrides): Promise<ContractTransaction>;

        company(overrides?: CallOverrides): Promise<{
            0: string;
        }>;

        "company()"(overrides?: CallOverrides): Promise<{
            0: string;
        }>;

        completeGoal(_user: string, _name: string, overrides?: Overrides): Promise<ContractTransaction>;

        "completeGoal(address,string)"(_user: string, _name: string, overrides?: Overrides): Promise<ContractTransaction>;

        createGoal(
            _user: string,
            _name: string,
            _description: string,
            _category: BigNumberish,
            _progress: BigNumberish,
            _target: BigNumberish,
            _unit: string,
            _deadline: BigNumberish,
            overrides?: PayableOverrides
        ): Promise<ContractTransaction>;

        "createGoal(address,string,string,uint8,uint256,uint256,string,uint256)"(
            _user: string,
            _name: string,
            _description: string,
            _category: BigNumberish,
            _progress: BigNumberish,
            _target: BigNumberish,
            _unit: string,
            _deadline: BigNumberish,
            overrides?: PayableOverrides
        ): Promise<ContractTransaction>;

        failGoal(_user: string, _name: string, overrides?: Overrides): Promise<ContractTransaction>;

        "failGoal(address,string)"(_user: string, _name: string, overrides?: Overrides): Promise<ContractTransaction>;

        getGoal(
            _user: string,
            _name: string,
            overrides?: CallOverrides
        ): Promise<{
            0: {
                name: string;
                description: string;
                category: number;
                progress: BigNumber;
                initial: BigNumber;
                target: BigNumber;
                unit: string;
                deadline: BigNumber;
                bounty: BigNumber;
                status: number;
                createdOn: BigNumber;
                0: string;
                1: string;
                2: number;
                3: BigNumber;
                4: BigNumber;
                5: BigNumber;
                6: string;
                7: BigNumber;
                8: BigNumber;
                9: number;
                10: BigNumber;
            };
        }>;

        "getGoal(address,string)"(
            _user: string,
            _name: string,
            overrides?: CallOverrides
        ): Promise<{
            0: {
                name: string;
                description: string;
                category: number;
                progress: BigNumber;
                initial: BigNumber;
                target: BigNumber;
                unit: string;
                deadline: BigNumber;
                bounty: BigNumber;
                status: number;
                createdOn: BigNumber;
                0: string;
                1: string;
                2: number;
                3: BigNumber;
                4: BigNumber;
                5: BigNumber;
                6: string;
                7: BigNumber;
                8: BigNumber;
                9: number;
                10: BigNumber;
            };
        }>;

        getGoals(
            _user: string,
            overrides?: CallOverrides
        ): Promise<{
            0: {
                name: string;
                description: string;
                category: number;
                progress: BigNumber;
                initial: BigNumber;
                target: BigNumber;
                unit: string;
                deadline: BigNumber;
                bounty: BigNumber;
                status: number;
                createdOn: BigNumber;
                0: string;
                1: string;
                2: number;
                3: BigNumber;
                4: BigNumber;
                5: BigNumber;
                6: string;
                7: BigNumber;
                8: BigNumber;
                9: number;
                10: BigNumber;
            }[];
        }>;

        "getGoals(address)"(
            _user: string,
            overrides?: CallOverrides
        ): Promise<{
            0: {
                name: string;
                description: string;
                category: number;
                progress: BigNumber;
                initial: BigNumber;
                target: BigNumber;
                unit: string;
                deadline: BigNumber;
                bounty: BigNumber;
                status: number;
                createdOn: BigNumber;
                0: string;
                1: string;
                2: number;
                3: BigNumber;
                4: BigNumber;
                5: BigNumber;
                6: string;
                7: BigNumber;
                8: BigNumber;
                9: number;
                10: BigNumber;
            }[];
        }>;

        goals(
            arg0: string,
            arg1: string,
            overrides?: CallOverrides
        ): Promise<{
            name: string;
            description: string;
            category: number;
            progress: BigNumber;
            initial: BigNumber;
            target: BigNumber;
            unit: string;
            deadline: BigNumber;
            bounty: BigNumber;
            status: number;
            createdOn: BigNumber;
            0: string;
            1: string;
            2: number;
            3: BigNumber;
            4: BigNumber;
            5: BigNumber;
            6: string;
            7: BigNumber;
            8: BigNumber;
            9: number;
            10: BigNumber;
        }>;

        "goals(address,string)"(
            arg0: string,
            arg1: string,
            overrides?: CallOverrides
        ): Promise<{
            name: string;
            description: string;
            category: number;
            progress: BigNumber;
            initial: BigNumber;
            target: BigNumber;
            unit: string;
            deadline: BigNumber;
            bounty: BigNumber;
            status: number;
            createdOn: BigNumber;
            0: string;
            1: string;
            2: number;
            3: BigNumber;
            4: BigNumber;
            5: BigNumber;
            6: string;
            7: BigNumber;
            8: BigNumber;
            9: number;
            10: BigNumber;
        }>;
    };

    addProgress(_user: string, _name: string, _value: BigNumberish, overrides?: Overrides): Promise<ContractTransaction>;

    "addProgress(address,string,uint256)"(_user: string, _name: string, _value: BigNumberish, overrides?: Overrides): Promise<ContractTransaction>;

    cancelGoal(_user: string, _name: string, overrides?: Overrides): Promise<ContractTransaction>;

    "cancelGoal(address,string)"(_user: string, _name: string, overrides?: Overrides): Promise<ContractTransaction>;

    company(overrides?: CallOverrides): Promise<string>;

    "company()"(overrides?: CallOverrides): Promise<string>;

    completeGoal(_user: string, _name: string, overrides?: Overrides): Promise<ContractTransaction>;

    "completeGoal(address,string)"(_user: string, _name: string, overrides?: Overrides): Promise<ContractTransaction>;

    createGoal(
        _user: string,
        _name: string,
        _description: string,
        _category: BigNumberish,
        _progress: BigNumberish,
        _target: BigNumberish,
        _unit: string,
        _deadline: BigNumberish,
        overrides?: PayableOverrides
    ): Promise<ContractTransaction>;

    "createGoal(address,string,string,uint8,uint256,uint256,string,uint256)"(
        _user: string,
        _name: string,
        _description: string,
        _category: BigNumberish,
        _progress: BigNumberish,
        _target: BigNumberish,
        _unit: string,
        _deadline: BigNumberish,
        overrides?: PayableOverrides
    ): Promise<ContractTransaction>;

    failGoal(_user: string, _name: string, overrides?: Overrides): Promise<ContractTransaction>;

    "failGoal(address,string)"(_user: string, _name: string, overrides?: Overrides): Promise<ContractTransaction>;

    getGoal(
        _user: string,
        _name: string,
        overrides?: CallOverrides
    ): Promise<{
        name: string;
        description: string;
        category: number;
        progress: BigNumber;
        initial: BigNumber;
        target: BigNumber;
        unit: string;
        deadline: BigNumber;
        bounty: BigNumber;
        status: number;
        createdOn: BigNumber;
        0: string;
        1: string;
        2: number;
        3: BigNumber;
        4: BigNumber;
        5: BigNumber;
        6: string;
        7: BigNumber;
        8: BigNumber;
        9: number;
        10: BigNumber;
    }>;

    "getGoal(address,string)"(
        _user: string,
        _name: string,
        overrides?: CallOverrides
    ): Promise<{
        name: string;
        description: string;
        category: number;
        progress: BigNumber;
        initial: BigNumber;
        target: BigNumber;
        unit: string;
        deadline: BigNumber;
        bounty: BigNumber;
        status: number;
        createdOn: BigNumber;
        0: string;
        1: string;
        2: number;
        3: BigNumber;
        4: BigNumber;
        5: BigNumber;
        6: string;
        7: BigNumber;
        8: BigNumber;
        9: number;
        10: BigNumber;
    }>;

    getGoals(
        _user: string,
        overrides?: CallOverrides
    ): Promise<
        {
            name: string;
            description: string;
            category: number;
            progress: BigNumber;
            initial: BigNumber;
            target: BigNumber;
            unit: string;
            deadline: BigNumber;
            bounty: BigNumber;
            status: number;
            createdOn: BigNumber;
            0: string;
            1: string;
            2: number;
            3: BigNumber;
            4: BigNumber;
            5: BigNumber;
            6: string;
            7: BigNumber;
            8: BigNumber;
            9: number;
            10: BigNumber;
        }[]
    >;

    "getGoals(address)"(
        _user: string,
        overrides?: CallOverrides
    ): Promise<
        {
            name: string;
            description: string;
            category: number;
            progress: BigNumber;
            initial: BigNumber;
            target: BigNumber;
            unit: string;
            deadline: BigNumber;
            bounty: BigNumber;
            status: number;
            createdOn: BigNumber;
            0: string;
            1: string;
            2: number;
            3: BigNumber;
            4: BigNumber;
            5: BigNumber;
            6: string;
            7: BigNumber;
            8: BigNumber;
            9: number;
            10: BigNumber;
        }[]
    >;

    goals(
        arg0: string,
        arg1: string,
        overrides?: CallOverrides
    ): Promise<{
        name: string;
        description: string;
        category: number;
        progress: BigNumber;
        initial: BigNumber;
        target: BigNumber;
        unit: string;
        deadline: BigNumber;
        bounty: BigNumber;
        status: number;
        createdOn: BigNumber;
        0: string;
        1: string;
        2: number;
        3: BigNumber;
        4: BigNumber;
        5: BigNumber;
        6: string;
        7: BigNumber;
        8: BigNumber;
        9: number;
        10: BigNumber;
    }>;

    "goals(address,string)"(
        arg0: string,
        arg1: string,
        overrides?: CallOverrides
    ): Promise<{
        name: string;
        description: string;
        category: number;
        progress: BigNumber;
        initial: BigNumber;
        target: BigNumber;
        unit: string;
        deadline: BigNumber;
        bounty: BigNumber;
        status: number;
        createdOn: BigNumber;
        0: string;
        1: string;
        2: number;
        3: BigNumber;
        4: BigNumber;
        5: BigNumber;
        6: string;
        7: BigNumber;
        8: BigNumber;
        9: number;
        10: BigNumber;
    }>;

    callStatic: {
        addProgress(_user: string, _name: string, _value: BigNumberish, overrides?: CallOverrides): Promise<void>;

        "addProgress(address,string,uint256)"(_user: string, _name: string, _value: BigNumberish, overrides?: CallOverrides): Promise<void>;

        cancelGoal(_user: string, _name: string, overrides?: CallOverrides): Promise<void>;

        "cancelGoal(address,string)"(_user: string, _name: string, overrides?: CallOverrides): Promise<void>;

        company(overrides?: CallOverrides): Promise<string>;

        "company()"(overrides?: CallOverrides): Promise<string>;

        completeGoal(_user: string, _name: string, overrides?: CallOverrides): Promise<void>;

        "completeGoal(address,string)"(_user: string, _name: string, overrides?: CallOverrides): Promise<void>;

        createGoal(
            _user: string,
            _name: string,
            _description: string,
            _category: BigNumberish,
            _progress: BigNumberish,
            _target: BigNumberish,
            _unit: string,
            _deadline: BigNumberish,
            overrides?: CallOverrides
        ): Promise<void>;

        "createGoal(address,string,string,uint8,uint256,uint256,string,uint256)"(
            _user: string,
            _name: string,
            _description: string,
            _category: BigNumberish,
            _progress: BigNumberish,
            _target: BigNumberish,
            _unit: string,
            _deadline: BigNumberish,
            overrides?: CallOverrides
        ): Promise<void>;

        failGoal(_user: string, _name: string, overrides?: CallOverrides): Promise<void>;

        "failGoal(address,string)"(_user: string, _name: string, overrides?: CallOverrides): Promise<void>;

        getGoal(
            _user: string,
            _name: string,
            overrides?: CallOverrides
        ): Promise<{
            name: string;
            description: string;
            category: number;
            progress: BigNumber;
            initial: BigNumber;
            target: BigNumber;
            unit: string;
            deadline: BigNumber;
            bounty: BigNumber;
            status: number;
            createdOn: BigNumber;
            0: string;
            1: string;
            2: number;
            3: BigNumber;
            4: BigNumber;
            5: BigNumber;
            6: string;
            7: BigNumber;
            8: BigNumber;
            9: number;
            10: BigNumber;
        }>;

        "getGoal(address,string)"(
            _user: string,
            _name: string,
            overrides?: CallOverrides
        ): Promise<{
            name: string;
            description: string;
            category: number;
            progress: BigNumber;
            initial: BigNumber;
            target: BigNumber;
            unit: string;
            deadline: BigNumber;
            bounty: BigNumber;
            status: number;
            createdOn: BigNumber;
            0: string;
            1: string;
            2: number;
            3: BigNumber;
            4: BigNumber;
            5: BigNumber;
            6: string;
            7: BigNumber;
            8: BigNumber;
            9: number;
            10: BigNumber;
        }>;

        getGoals(
            _user: string,
            overrides?: CallOverrides
        ): Promise<
            {
                name: string;
                description: string;
                category: number;
                progress: BigNumber;
                initial: BigNumber;
                target: BigNumber;
                unit: string;
                deadline: BigNumber;
                bounty: BigNumber;
                status: number;
                createdOn: BigNumber;
                0: string;
                1: string;
                2: number;
                3: BigNumber;
                4: BigNumber;
                5: BigNumber;
                6: string;
                7: BigNumber;
                8: BigNumber;
                9: number;
                10: BigNumber;
            }[]
        >;

        "getGoals(address)"(
            _user: string,
            overrides?: CallOverrides
        ): Promise<
            {
                name: string;
                description: string;
                category: number;
                progress: BigNumber;
                initial: BigNumber;
                target: BigNumber;
                unit: string;
                deadline: BigNumber;
                bounty: BigNumber;
                status: number;
                createdOn: BigNumber;
                0: string;
                1: string;
                2: number;
                3: BigNumber;
                4: BigNumber;
                5: BigNumber;
                6: string;
                7: BigNumber;
                8: BigNumber;
                9: number;
                10: BigNumber;
            }[]
        >;

        goals(
            arg0: string,
            arg1: string,
            overrides?: CallOverrides
        ): Promise<{
            name: string;
            description: string;
            category: number;
            progress: BigNumber;
            initial: BigNumber;
            target: BigNumber;
            unit: string;
            deadline: BigNumber;
            bounty: BigNumber;
            status: number;
            createdOn: BigNumber;
            0: string;
            1: string;
            2: number;
            3: BigNumber;
            4: BigNumber;
            5: BigNumber;
            6: string;
            7: BigNumber;
            8: BigNumber;
            9: number;
            10: BigNumber;
        }>;

        "goals(address,string)"(
            arg0: string,
            arg1: string,
            overrides?: CallOverrides
        ): Promise<{
            name: string;
            description: string;
            category: number;
            progress: BigNumber;
            initial: BigNumber;
            target: BigNumber;
            unit: string;
            deadline: BigNumber;
            bounty: BigNumber;
            status: number;
            createdOn: BigNumber;
            0: string;
            1: string;
            2: number;
            3: BigNumber;
            4: BigNumber;
            5: BigNumber;
            6: string;
            7: BigNumber;
            8: BigNumber;
            9: number;
            10: BigNumber;
        }>;
    };

    filters: {
        GoalCancelled(_from: string | null, _name: string | null): EventFilter;

        GoalCompleted(_from: string | null, _name: string | null): EventFilter;

        GoalFailed(_from: string | null, _name: string | null): EventFilter;

        GoalStarted(_from: string | null, _name: string | null): EventFilter;
    };

    estimateGas: {
        addProgress(_user: string, _name: string, _value: BigNumberish, overrides?: Overrides): Promise<BigNumber>;

        "addProgress(address,string,uint256)"(_user: string, _name: string, _value: BigNumberish, overrides?: Overrides): Promise<BigNumber>;

        cancelGoal(_user: string, _name: string, overrides?: Overrides): Promise<BigNumber>;

        "cancelGoal(address,string)"(_user: string, _name: string, overrides?: Overrides): Promise<BigNumber>;

        company(overrides?: CallOverrides): Promise<BigNumber>;

        "company()"(overrides?: CallOverrides): Promise<BigNumber>;

        completeGoal(_user: string, _name: string, overrides?: Overrides): Promise<BigNumber>;

        "completeGoal(address,string)"(_user: string, _name: string, overrides?: Overrides): Promise<BigNumber>;

        createGoal(
            _user: string,
            _name: string,
            _description: string,
            _category: BigNumberish,
            _progress: BigNumberish,
            _target: BigNumberish,
            _unit: string,
            _deadline: BigNumberish,
            overrides?: PayableOverrides
        ): Promise<BigNumber>;

        "createGoal(address,string,string,uint8,uint256,uint256,string,uint256)"(
            _user: string,
            _name: string,
            _description: string,
            _category: BigNumberish,
            _progress: BigNumberish,
            _target: BigNumberish,
            _unit: string,
            _deadline: BigNumberish,
            overrides?: PayableOverrides
        ): Promise<BigNumber>;

        failGoal(_user: string, _name: string, overrides?: Overrides): Promise<BigNumber>;

        "failGoal(address,string)"(_user: string, _name: string, overrides?: Overrides): Promise<BigNumber>;

        getGoal(_user: string, _name: string, overrides?: CallOverrides): Promise<BigNumber>;

        "getGoal(address,string)"(_user: string, _name: string, overrides?: CallOverrides): Promise<BigNumber>;

        getGoals(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

        "getGoals(address)"(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

        goals(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;

        "goals(address,string)"(arg0: string, arg1: string, overrides?: CallOverrides): Promise<BigNumber>;
    };

    populateTransaction: {
        addProgress(_user: string, _name: string, _value: BigNumberish, overrides?: Overrides): Promise<PopulatedTransaction>;

        "addProgress(address,string,uint256)"(_user: string, _name: string, _value: BigNumberish, overrides?: Overrides): Promise<PopulatedTransaction>;

        cancelGoal(_user: string, _name: string, overrides?: Overrides): Promise<PopulatedTransaction>;

        "cancelGoal(address,string)"(_user: string, _name: string, overrides?: Overrides): Promise<PopulatedTransaction>;

        company(overrides?: CallOverrides): Promise<PopulatedTransaction>;

        "company()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

        completeGoal(_user: string, _name: string, overrides?: Overrides): Promise<PopulatedTransaction>;

        "completeGoal(address,string)"(_user: string, _name: string, overrides?: Overrides): Promise<PopulatedTransaction>;

        createGoal(
            _user: string,
            _name: string,
            _description: string,
            _category: BigNumberish,
            _progress: BigNumberish,
            _target: BigNumberish,
            _unit: string,
            _deadline: BigNumberish,
            overrides?: PayableOverrides
        ): Promise<PopulatedTransaction>;

        "createGoal(address,string,string,uint8,uint256,uint256,string,uint256)"(
            _user: string,
            _name: string,
            _description: string,
            _category: BigNumberish,
            _progress: BigNumberish,
            _target: BigNumberish,
            _unit: string,
            _deadline: BigNumberish,
            overrides?: PayableOverrides
        ): Promise<PopulatedTransaction>;

        failGoal(_user: string, _name: string, overrides?: Overrides): Promise<PopulatedTransaction>;

        "failGoal(address,string)"(_user: string, _name: string, overrides?: Overrides): Promise<PopulatedTransaction>;

        getGoal(_user: string, _name: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

        "getGoal(address,string)"(_user: string, _name: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

        getGoals(_user: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

        "getGoals(address)"(_user: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

        goals(arg0: string, arg1: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;

        "goals(address,string)"(arg0: string, arg1: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
