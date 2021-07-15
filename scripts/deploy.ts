import { ethers } from "hardhat";

async function main() {
    const HabitTracker = await ethers.getContractFactory("HabitTracker");
    const tracker = await HabitTracker.deploy("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");

    await tracker.deployed();

    console.log("HabitTracker contract deployed to:", tracker.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
