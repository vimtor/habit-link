import {ethers} from "hardhat";
import {expect, assert} from "chai";
import {HabitTracker} from "../typechain";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

describe("HabitTracker", () => {
    let tracker: HabitTracker;
    let owner: SignerWithAddress;
    let anonymous: SignerWithAddress;

    beforeEach(async () => {
        const habitTrackerContract = await ethers.getContractFactory("HabitTracker");
        const signers = await ethers.getSigners();
        owner = signers[0];
        anonymous = signers[1];
        tracker = (await habitTrackerContract.deploy() as HabitTracker)
    });

    describe("create goal", () => {
        it("initializes progress to 0 by default", async () => {
            await tracker.createGoal(owner.address, 'reading', 10, Date.now() + 10000, 'pages')
            const progress = await tracker.getProgress(owner.address, 'reading');
            expect(progress).to.equal(0);
        });

        it("creates a goal for other user", async () => {
            await tracker.createGoal(anonymous.address, 'reading', 10, Date.now() + 10000, 'pages')
        });

        it("can create multiple goals for the same user", async () => {
            await tracker.createGoal(owner.address, 'reading', 10, Date.now() + 10000, 'pages')
            await tracker.createGoal(owner.address, 'running', 10, Date.now() + 10000, 'miles')

            expect(await tracker.getProgress(owner.address, 'reading')).to.equal(0);
            expect(await tracker.getProgress(owner.address, 'running')).to.equal(0);
        });

        it("cannot create multiple goals with the same name", async () => {
            await tracker.createGoal(owner.address, 'reading', 10, Date.now() + 10000, 'pages')
            try {
                await tracker.createGoal(owner.address, 'reading', 10, Date.now() + 10000, 'pages')
                assert.fail(0, 1, 'Exception not thrown');
            } catch (error) {
                expect(error.message).to.contain("already has a goal with that name")
            }
        });

        it("throws if the deadline is already over", async () => {
            try {
                await tracker.createGoal(owner.address, 'reading', 10, 0, 'pages')
                assert.fail(0, 1, 'Exception not thrown');
            } catch (error) {
                expect(error.message).to.contain("past goal cannot be created")
            }
        });
    })

    describe("update progress", () => {
        it('updates the progress by the specified amount', async () => {
            await tracker.createGoal(owner.address, 'reading', 10, Date.now() + 10000, 'pages')
            expect(await tracker.getProgress(owner.address, 'reading')).to.equal(0);

            await tracker.addProgress(owner.address, 'reading', 1);
            expect(await tracker.getProgress(owner.address, 'reading')).to.equal(1);

            await tracker.addProgress(owner.address, 'reading', 2);
            expect(await tracker.getProgress(owner.address, 'reading')).to.equal(3);
        });

        it('throws if user adding progress is not the owner', async () => {
            try {
                await tracker.createGoal(owner.address, 'reading', 10, Date.now() + 10000, 'pages')
                await tracker.createGoal(anonymous.address, 'running', 10, Date.now() + 10000, 'miles')
                await tracker.addProgress(anonymous.address, 'running', 1);
                assert.fail(0, 1, 'Exception not thrown');
            } catch (error) {
                expect(error.message).to.contain("only be called by the owner")
            }
        });

        it('throws if user has zero goals', async () => {
            try {
                await tracker.addProgress(owner.address, 'reading', 1);
                assert.fail(0, 1, 'Exception not thrown');
            } catch (error) {
                expect(error.message).to.contain("does not have any goals")
            }
        });

        it('throws if goal with a name does not exist', async () => {
            try {
                await tracker.createGoal(owner.address, 'running', 10, Date.now() + 10000, 'miles')
                await tracker.addProgress(owner.address, 'reading', 1);
                assert.fail(0, 1, 'Exception not thrown');
            } catch (error) {
                expect(error.message).to.contain("does not have a goal with that name")
            }
        });
    })
});
