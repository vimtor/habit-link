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
    TOTAL_MORE,
    TOTAL_LESS,
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

    // Helper for creating goal with sensible defaults
    const createGoal = async (options = {}) => {
        const goal = {
            user: owner.address,
            category: Category.MORE,
            progress: 0,
            target: 100,
            name: "reading",
            description: "read one book a week",
            unit: "pages",
            deadline: now + 1000,
            bounty: BigNumber.from(100),
            ...options,
        };
        return tracker.createGoal(goal.user, goal.name, goal.description, goal.category, goal.progress, goal.target, goal.unit, goal.deadline, {
            value: goal.bounty,
        });
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
                description: "read one book a week",
                unit: "pages",
                deadline: now + 1000,
                bounty: BigNumber.from(100),
                status: Status.ONGOING,
            };

            await createGoal(options);
            const goal = await tracker.getGoal(owner.address, "reading");

            expect(goal.name).to.equal(options.name);
            expect(goal.description).to.equal(options.description);
            expect(goal.category).to.equal(options.category);
            expect(goal.progress).to.equal(options.progress);
            expect(goal.target).to.equal(options.target);
            expect(goal.initial).to.equal(options.progress);
            expect(goal.unit).to.equal(options.unit);
            expect(goal.deadline).to.equal(options.deadline);
            expect(goal.bounty).to.equal(options.bounty);
            expect(goal.status).to.equal(options.status);
            expect(goal.createdOn).to.be.closeTo(BigNumber.from(now), 10);
        });

        it("transfers funds on creation according to bounty parameter", async () => {
            const bounty = BigNumber.from(10000000000000);
            await expect(await createGoal({ bounty })).to.changeEtherBalance(owner, -bounty);
            const goal = await tracker.getGoal(owner.address, "reading");
            expect(goal.bounty).to.equal(bounty);
        });

        it("reverts if value is zero", async () => {
            await expect(createGoal({ bounty: BigNumber.from(0) })).to.be.revertedWith("The goal bounty cannot be empty");
        });

        it("reverts if name is empty", async () => {
            await expect(createGoal({ name: "" })).to.be.revertedWith("Goal name cannot be empty");
        });

        it("reverts if user creates a goal for other user", async () => {
            await expect(createGoal({ user: anonymous.address })).to.be.revertedWith("This function can only be called by the owner");
        });

        it("can create multiple goals for the same user", async () => {
            await createGoal({ name: "reading", unit: "pages" });
            await createGoal({ name: "running", unit: "miles" });
            const goals = await tracker.getGoals(owner.address);
            expect(goals).to.have.length(2);
            expect(goals[0].name).to.equal("reading");
            expect(goals[1].name).to.equal("running");
        });

        it("reverts when creating two goals with the same name", async () => {
            await createGoal({ name: "reading " });
            await expect(createGoal({ name: "reading " })).to.be.revertedWith("already has a goal with that name");
        });

        it("reverts if the deadline is already over", async () => {
            await expect(createGoal({ deadline: 0 })).to.be.revertedWith("past goal cannot be created");
        });

        it("reverts if goal is already completed", async () => {
            await expect(createGoal({ progress: 12, target: 10, category: Category.MORE })).to.be.revertedWith("Goal is already completed");
            await expect(createGoal({ progress: 12, target: 10, category: Category.TOTAL_MORE })).to.be.revertedWith("Goal is already completed");
            await expect(createGoal({ progress: 70, target: 80, category: Category.LESS })).to.be.revertedWith("Goal is already completed");
            await expect(createGoal({ progress: 70, target: 80, category: Category.TOTAL_LESS })).to.be.revertedWith("Goal is already completed");
        });

        it("emits a started event", async () => {
            await expect(createGoal()).to.emit(tracker, "GoalStarted").withArgs(owner.address, "reading");
        });
    });

    describe("add progress", () => {
        // it("reverts if user adding progress is not the owner", async () => {
        //     await createGoal({ user: owner.address, name: "reading", unit: "pages" });
        //     await createGoal({ user: anonymous.address, name: "running", unit: "miles" });
        //     await expect(tracker.addProgress(anonymous.address, "running", 1)).to.be.revertedWith("function can only be called by the owner");
        // });

        it("reverts if goal with a name does not exist", async () => {
            await createGoal({ name: "running" });
            await expect(tracker.addProgress(owner.address, "reading", 1)).to.be.revertedWith("does not have a goal with that name");
        });

        it("updates progress of goals categorized as MORE", async () => {
            await createGoal({ name: "running", progress: 2, target: 10, category: Category.MORE });
            await tracker.addProgress(owner.address, "running", 4);
            const progress = (await tracker.getGoal(owner.address, "running")).progress;
            expect(progress).to.equal(6);
        });

        it("updates progress of goals categorized as LESS", async () => {
            await createGoal({ name: "running", progress: 10, target: 0, category: Category.LESS });
            await tracker.addProgress(owner.address, "running", 4);
            const progress = (await tracker.getGoal(owner.address, "running")).progress;
            expect(progress).to.equal(6);
        });

        it("updates progress of goals categorized as TOTAL_MORE", async () => {
            await createGoal({ name: "running", progress: 2, target: 10, category: Category.TOTAL_MORE });
            await tracker.addProgress(owner.address, "running", 4);
            const progress = (await tracker.getGoal(owner.address, "running")).progress;
            expect(progress).to.equal(4);
        });

        it("updates progress of goals categorized as TOTAL_LESS", async () => {
            await createGoal({ name: "running", progress: 10, target: 0, category: Category.TOTAL_LESS });
            await tracker.addProgress(owner.address, "running", 4);
            const progress = (await tracker.getGoal(owner.address, "running")).progress;
            expect(progress).to.equal(4);
        });

        it("does not alter initial value", async () => {
            await createGoal({ name: "running", progress: 2, target: 10, category: Category.MORE });
            await tracker.addProgress(owner.address, "running", 4);
            const goal = await tracker.getGoal(owner.address, "running");
            expect(goal.initial).to.equal(2);
        });
    });

    describe("complete goal", () => {
        it("reverts if goal with a name does not exist", async () => {
            await createGoal({ name: "running" });
            await expect(tracker.completeGoal(owner.address, "reading")).to.be.revertedWith("does not have a goal with that name");
        });

        // it("reverts if user adding progress is not the owner", async () => {
        //     await createGoal({ user: owner.address, name: "reading", unit: "pages" });
        //     await createGoal({ user: anonymous.address, name: "running", unit: "miles" });
        //     await expect(tracker.completeGoal(anonymous.address, "reading")).to.be.revertedWith("function can only be called by the owner");
        // });

        it("reverts if goal target has not been reached", async () => {
            await createGoal({ name: "running", progress: 0, target: 10 });
            await expect(tracker.completeGoal(owner.address, "running")).to.be.revertedWith("goal has not been reached yet");
        });

        it("transfers bounty back when target has been reached", async () => {
            const bounty = BigNumber.from(10000000000000);
            await createGoal({ name: "running", progress: 0, target: 10, bounty });
            await tracker.addProgress(owner.address, "running", 12);
            await expect(await tracker.completeGoal(owner.address, "running")).to.changeEtherBalance(owner, bounty);
        });

        it("reverts if goal is already marked as complete", async () => {
            const bounty = BigNumber.from(10000000000000);
            await createGoal({ name: "running", progress: 0, target: 10, bounty });
            await tracker.addProgress(owner.address, "running", 12);
            await tracker.completeGoal(owner.address, "running");
            await expect(tracker.completeGoal(owner.address, "running")).to.be.revertedWith("Goal must be ongoing");
        });

        it("goal status transitions to COMPLETED when target has been reached", async () => {
            await createGoal({ name: "running", progress: 0, target: 10 });
            await tracker.addProgress(owner.address, "running", 12);
            await tracker.completeGoal(owner.address, "running");
            const goal = await tracker.getGoal(owner.address, "running");
            expect(goal.status).to.be.equal(Status.COMPLETED);
        });

        it("completes goals categorized as MORE", async () => {
            await createGoal({ name: "running", progress: 0, target: 10, category: Category.MORE });
            await tracker.addProgress(owner.address, "running", 12);
            await tracker.completeGoal(owner.address, "running");
            const goal = await tracker.getGoal(owner.address, "running");
            expect(goal.status).to.be.equal(Status.COMPLETED);
        });

        it("emits a completed event", async () => {
            await createGoal({ name: "running", progress: 0, target: 10 });
            await tracker.addProgress(owner.address, "running", 12);
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

        it("transfers bounty to company", async () => {
            const bounty = BigNumber.from(100);
            await createGoal({ name: "reading", deadline: now + 60, bounty });
            await increaseTime(61);
            await expect(await tracker.failGoal(owner.address, "reading")).to.changeEtherBalance(company, bounty);
        });

        it("emits a failed event", async () => {
            await createGoal({ name: "reading", deadline: now + 60 });
            await increaseTime(61);
            await expect(tracker.failGoal(owner.address, "reading")).to.emit(tracker, "GoalFailed").withArgs(owner.address, "reading");
        });
    });
});
