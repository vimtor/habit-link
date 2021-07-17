import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import { task, HardhatUserConfig } from "hardhat/config";

task("accounts", "Prints the list of accounts", async (args, hre) => {
    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
        console.log(account.address);
    }
});

const config: HardhatUserConfig = {
    networks: {
        hardhat: {
            accounts: {
                mnemonic: "test test test test test test test test test test test junk",
            },
        },
    },
    typechain: {
        outDir: "./frontend/types/ethers",
        target: "ethers-v5",
    },
    solidity: "0.8.4",
};

export default config;
