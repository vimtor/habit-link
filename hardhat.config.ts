import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy-ethers";
import "hardhat-deploy";
import "@symfoni/hardhat-react";
import "hardhat-typechain";
import "@typechain/ethers-v5";
import { task, HardhatUserConfig } from "hardhat/config";

task("accounts", "Prints the list of accounts", async (args, hre) => {
    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
        console.log(account.address);
    }
});

task("types", async (args, hre) => {
    hre.config.typechain.outDir = "./frontend/utils";
    await hre.run("compile");
    await hre.run("react");

    hre.config.typechain.outDir = "./typechain";
    await hre.run("compile");
});

const config: HardhatUserConfig = {
    paths: {
        react: "./frontend/hooks",
    },
    react: {
        providerPriority: ["web3modal", "hardhat"],
    },
    networks: {
        hardhat: {
            inject: false,
            accounts: {
                mnemonic: "test test test test test test test test test test test junk",
            },
        },
    },
    typechain: {
        outDir: "./frontend/utils",
    },
    solidity: "0.8.4",
};

export default config;
