import { ethers, network } from "hardhat";
import { expect, use } from "chai";
import { solidity } from "ethereum-waffle";
import { HabitTracker } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

use(solidity);

enum Status {
    ONGOING,
    COMPLETED,
    CANCELLED,
    FAILED,
}

enum Category {
    MORE,
    LESS,
}

describe("HabitTracker", () => {
    let tracker: HabitTracker;
    let owner: SignerWithAddress;
    let anonymous: SignerWithAddress;
    let company: SignerWithAddress;
    let now: number;

    beforeEach(async () => {
        const habitTrackerContract = await ethers.getContractFactory("HabitTracker");
        const signers = await ethers.getSigners();
        owner = signers[0];
        anonymous = signers[1];
        company = signers[2];
        tracker = (await habitTrackerContract.deploy(company.address)) as HabitTracker;

        const number = await tracker.provider.getBlockNumber();
        const block = await tracker.provider.getBlock(number);
        now = block.timestamp;
    });

    // Create goal helper with sensible defaults
    const createGoal = async (options = {}) => {
        const goal = {
            user: owner.address,
            category: Category.MORE,
            progress: 0,
            target: 100,
            name: "reading",
            unit: "pages",
            deadline: now + 1000,
            stake: BigNumber.from(100),
            ...options,
        };
        return tracker.createGoal(goal.user, goal.name, goal.category, goal.progress, goal.target, goal.unit, goal.deadline, { value: goal.stake });
    };

    const increaseTime = async (amount: number) => {
        await network.provider.send("evm_increaseTime", [amount]);
        await network.provider.send("evm_mine");
        now += amount;
    };

    describe("create goal", () => {
        it("initializes goal correctly", async () => {
            const options = {
                user: owner.address,
                category: Category.MORE,
                progress: 0,
                target: 100,
                name: "reading",
                unit: "pages",
                deadline: now + 1000,
                stake: BigNumber.from(100),
                status: Status.ONGOING,
            };

            await createGoal(options);
            const goal = await tracker.getGoal(owner.address, "reading");

            expect(goal.name).to.equal(options.name);
            expect(goal.category).to.equal(options.category);
            expect(goal.progress).to.equal(options.progress);
            expect(goal.target).to.equal(options.target);
            expect(goal.unit).to.equal(options.unit);
            expect(goal.deadline).to.equal(options.deadline);
            expect(goal.stake).to.equal(options.stake);
            expect(goal.status).to.equal(options.status);
        });

        it("transfers funds on creation according to stake parameter", async () => {
            const stake = BigNumber.from(10000000000000);
            await expect(await createGoal({ stake })).to.changeEtherBalance(owner, -stake);
            const goal = await tracker.getGoal(owner.address, "reading");
            expect(goal.stake).to.equal(stake);
        });

        it("reverts if value is zero", async () => {
            await expect(createGoal({ stake: BigNumber.from(0) })).to.be.revertedWith("The goal stake cannot be empty");
        });

        it("can create a goal for other user", async () => {
            await expect(createGoal({ user: anonymous.address })).not.to.be.reverted;
        });

        it("can create multiple goals for the same user", async () => {
            await createGoal({ name: "reading", unit: "pages" });
            await createGoal({ name: "running", unit: "miles" });
            const readingGoal = await tracker.getGoal(owner.address, "reading");
            const runningGoal = await tracker.getGoal(owner.address, "running");
            expect(readingGoal.progress).to.equal(0);
            expect(runningGoal.progress).to.equal(0);
        });

        it("reverts when creating two goals with the same name", async () => {
            await createGoal({ name: "reading " });
            await expect(createGoal({ name: "reading " })).to.be.revertedWith("already has a goal with that name");
        });

        it("reverts if the deadline is already over", async () => {
            await expect(createGoal({ deadline: 0 })).to.be.revertedWith("past goal cannot be created");
        });

        it("emits a started event", async () => {
            await expect(createGoal()).to.emit(tracker, "GoalStarted").withArgs(owner.address, "reading");
        });
    });

    describe("update progress", () => {
        it("updates the progress by the specified amount", async () => {
            await createGoal({ name: "reading" });
            let progress = (await tracker.getGoal(owner.address, "reading")).progress;
            expect(progress).to.equal(0);

            await tracker.addProgress(owner.address, "reading", 1);
            progress = (await tracker.getGoal(owner.address, "reading")).progress;
            expect(progress).to.equal(1);

            await tracker.addProgress(owner.address, "reading", 2);
            progress = (await tracker.getGoal(owner.address, "reading")).progress;
            expect(progress).to.equal(3);
        });

        it("reverts if user adding progress is not the owner", async () => {
            await createGoal({ user: owner.address, name: "reading", unit: "pages" });
            await createGoal({ user: anonymous.address, name: "running", unit: "miles" });
            await expect(tracker.addProgress(anonymous.address, "running", 1)).to.be.revertedWith("function can only be called by the owner");
        });

        it("reverts if goal with a name does not exist", async () => {
            await createGoal({ name: "running" });
            await expect(tracker.addProgress(owner.address, "reading", 1)).to.be.revertedWith("does not have a goal with that name");
        });
    });

    describe("complete goal", () => {
        it("reverts if goal with a name does not exist", async () => {
            await createGoal({ name: "running" });
            await expect(tracker.completeGoal(owner.address, "reading")).to.be.revertedWith("does not have a goal with that name");
        });

        it("reverts if user adding progress is not the owner", async () => {
            await createGoal({ user: owner.address, name: "reading", unit: "pages" });
            await createGoal({ user: anonymous.address, name: "running", unit: "miles" });
            await expect(tracker.completeGoal(anonymous.address, "reading")).to.be.revertedWith("function can only be called by the owner");
        });

        it("reverts if goal target has not been reached", async () => {
            await createGoal({ name: "running", progress: 0, target: 10 });
            await expect(tracker.completeGoal(owner.address, "running")).to.be.revertedWith("goal has not been reached yet");
        });

        it("transfers stake back when target has been reached", async () => {
            const stake = BigNumber.from(10000000000000);
            await createGoal({ name: "running", progress: 12, target: 10, stake });
            await expect(await tracker.completeGoal(owner.address, "running")).to.changeEtherBalance(owner, stake);
        });

        it("reverts if goal is already marked as complete", async () => {
            const stake = BigNumber.from(10000000000000);
            await createGoal({ name: "running", progress: 12, target: 10, stake });
            await tracker.completeGoal(owner.address, "running");
            await expect(tracker.completeGoal(owner.address, "running")).to.be.revertedWith("Goal must be ongoing");
        });

        it("goal status transitions to COMPLETED when target has been reached", async () => {
            await createGoal({ name: "running", progress: 12, target: 10 });
            await tracker.completeGoal(owner.address, "running");
            const goal = await tracker.getGoal(owner.address, "running");
            expect(goal.status).to.be.equal(Status.COMPLETED);
        });

        it("emits a completed event", async () => {
            await createGoal({ name: "running", progress: 12, target: 10 });
            await expect(tracker.completeGoal(owner.address, "running")).to.emit(tracker, "GoalCompleted").withArgs(owner.address, "running");
        });
    });

    describe("fail goal", () => {
        it("reverts if goal with a name does not exist", async () => {
            await expect(tracker.failGoal(owner.address, "reading")).to.be.revertedWith("does not have a goal with that name");
        });

        it("reverts if goal is still ongoing", async () => {
            await createGoal({ name: "running" });
            await expect(tracker.failGoal(owner.address, "running")).to.be.revertedWith("goal is still ongoing");
        });

        it("transitions goal status to FAILED", async () => {
            await createGoal({ name: "reading", deadline: now + 60 });
            await increaseTime(61);
            await tracker.failGoal(owner.address, "reading");
            const goal = await tracker.getGoal(owner.address, "reading");
            expect(goal.status).to.be.equal(Status.FAILED);
        });

        it("transfers stake to company", async () => {
            const stake = BigNumber.from(100);
            await createGoal({ name: "reading", deadline: now + 60, stake });
            await increaseTime(61);
            await expect(await tracker.failGoal(owner.address, "reading")).to.changeEtherBalance(company, stake);
        });

        it("emits a failed event", async () => {
            await createGoal({ name: "reading", deadline: now + 60 });
            await increaseTime(61);
            await expect(tracker.failGoal(owner.address, "reading")).to.emit(tracker, "GoalFailed").withArgs(owner.address, "reading");
        });
    });
});
