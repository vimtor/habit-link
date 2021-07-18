/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { HabitSource, HabitSourceInterface } from "../HabitSource";

const _abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_trackerAddress",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "to",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "progress",
                type: "uint256",
            },
        ],
        name: "addProgress",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "registerActivity",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];

const _bytecode =
    "0x608060405234801561001057600080fd5b5060405161027b38038061027b8339818101604052810190610032919061008d565b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550506100ff565b600081519050610087816100e8565b92915050565b60006020828403121561009f57600080fd5b60006100ad84828501610078565b91505092915050565b60006100c1826100c8565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6100f1816100b6565b81146100fc57600080fd5b50565b61016d8061010e6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80630f5708a31461003b5780632b1dfd3414610057575b600080fd5b61005560048036038101906100509190610091565b610061565b005b61005f610065565b005b5050565b565b60008135905061007681610109565b92915050565b60008135905061008b81610120565b92915050565b600080604083850312156100a457600080fd5b60006100b285828601610067565b92505060206100c38582860161007c565b9150509250929050565b60006100d8826100df565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b610112816100cd565b811461011d57600080fd5b50565b610129816100ff565b811461013457600080fd5b5056fea2646970667358221220e5706086a95dabe71d1700d4ab7bd0c1c96912cd2c7a1c469506fd4babf9a9aa64736f6c63430008040033";

export class HabitSource__factory extends ContractFactory {
    constructor(signer?: Signer) {
        super(_abi, _bytecode, signer);
    }

    deploy(_trackerAddress: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<HabitSource> {
        return super.deploy(_trackerAddress, overrides || {}) as Promise<HabitSource>;
    }
    getDeployTransaction(_trackerAddress: string, overrides?: Overrides & { from?: string | Promise<string> }): TransactionRequest {
        return super.getDeployTransaction(_trackerAddress, overrides || {});
    }
    attach(address: string): HabitSource {
        return super.attach(address) as HabitSource;
    }
    connect(signer: Signer): HabitSource__factory {
        return super.connect(signer) as HabitSource__factory;
    }
    static readonly bytecode = _bytecode;
    static readonly abi = _abi;
    static createInterface(): HabitSourceInterface {
        return new utils.Interface(_abi) as HabitSourceInterface;
    }
    static connect(address: string, signerOrProvider: Signer | Provider): HabitSource {
        return new Contract(address, _abi, signerOrProvider) as HabitSource;
    }
}