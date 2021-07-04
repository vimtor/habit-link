import { ethers } from "hardhat";
import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { HabitTracker } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

use(solidity);

describe("HabitTracker", () => {
    let tracker: HabitTracker;
    let owner: SignerWithAddress;
    let anonymous: SignerWithAddress;

    beforeEach(async () => {
        const habitTrackerContract = await ethers.getContractFactory("HabitTracker");
        const signers = await ethers.getSigners();
        owner = signers[0];
        anonymous = signers[1];
        tracker = (await habitTrackerContract.deploy()) as HabitTracker;
    });

    describe("create goal", () => {
        it("initializes progress to 0 by default", async () => {
            const transaction = await tracker.createGoal(owner.address, "reading", 10, Date.now() + 10000, "pages", { value: 10 });
            const goal = await tracker.getGoal(owner.address, "reading");
            expect(goal.status).to.equal(0);
            expect(goal.stake).to.equal(transaction.value).to.equal(10);
        });

        it("throws if value is zero", async () => {
            await expect(tracker.createGoal(owner.address, "reading", 10, Date.now() + 10000, "pages", { value: 0 })).to.be.revertedWith(
                "goal stake cannot be empty"
            );
        });

        it("creates a goal for other user", async () => {
            await tracker.createGoal(anonymous.address, "reading", 10, Date.now() + 10000, "pages", { value: 10 });
        });

        it("can create multiple goals for the same user", async () => {
            await tracker.createGoal(owner.address, "reading", 10, Date.now() + 10000, "pages", { value: 10 });
            await tracker.createGoal(owner.address, "running", 10, Date.now() + 10000, "miles", { value: 10 });
            const readingGoal = await tracker.getGoal(owner.address, "reading");
            const runningGoal = await tracker.getGoal(owner.address, "running");
            expect(readingGoal.progress);
            expect(runningGoal.progress);
        });

        it("cannot create multiple goals with the same name", async () => {
            await tracker.createGoal(owner.address, "reading", 10, Date.now() + 10000, "pages", { value: 10 });
            await expect(tracker.createGoal(owner.address, "reading", 10, Date.now() + 10000, "pages")).to.be.revertedWith("already has a goal with that name");
        });

        it("throws if the deadline is already over", async () => {
            await expect(tracker.createGoal(owner.address, "reading", 10, 0, "pages")).to.be.revertedWith("past goal cannot be created");
        });
    });

    describe("update progress", () => {
        it("updates the progress by the specified amount", async () => {
            await tracker.createGoal(owner.address, "reading", 10, Date.now() + 10000, "pages", { value: 10 });
            let progress = (await tracker.getGoal(owner.address, "reading")).progress;
            expect(progress).to.equal(0);

            await tracker.addProgress(owner.address, "reading", 1);
            progress = (await tracker.getGoal(owner.address, "reading")).progress;
            expect(progress).to.equal(1);

            await tracker.addProgress(owner.address, "reading", 2);
            progress = (await tracker.getGoal(owner.address, "reading")).progress;
            expect(progress).to.equal(3);
        });

        it("throws if user adding progress is not the owner", async () => {
            await tracker.createGoal(owner.address, "reading", 10, Date.now() + 10000, "pages", { value: 10 });
            await tracker.createGoal(anonymous.address, "running", 10, Date.now() + 10000, "miles", { value: 10 });
            await expect(tracker.addProgress(anonymous.address, "running", 1)).to.be.revertedWith("function can only be called by the owner");
        });

        it("throws if user has zero goals", async () => {
            await expect(tracker.addProgress(owner.address, "reading", 1)).to.be.revertedWith("does not have any goals");
        });

        it("throws if goal with a name does not exist", async () => {
            await tracker.createGoal(owner.address, "running", 10, Date.now() + 10000, "miles", { value: 10 });
            await expect(tracker.addProgress(owner.address, "reading", 1)).to.be.revertedWith("does not have a goal with that name");
        });
    });
});
