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
            await tracker.createGoal('run 10 miles', 10, Date.now() + 10000, 'miles')
            const progress = await tracker.getProgress(owner.address);
            expect(progress).to.equal(0);
        });

        it("throws if the deadline has passed", async () => {
            try {
                await tracker.createGoal('run 10 miles', 10, 0, 'miles')
                assert.fail(0, 1, 'Exception not thrown');
            } catch (error) {
                expect(error.message).to.contain("past goal cannot be created")
            }
        });
    })

    describe("update progress", () => {
        it('updates the progress by the specified amount', async () => {
            await tracker.createGoal('run 10 miles', 10, Date.now() + 10000, 'miles')
            expect(await tracker.getProgress(owner.address)).to.equal(0);

            await tracker.addProgress(owner.address, 1);
            expect(await tracker.getProgress(owner.address)).to.equal(1);

            await tracker.addProgress(owner.address, 2);
            expect(await tracker.getProgress(owner.address)).to.equal(3);
        });

        it('throws if no goal exists for that user', async () => {
            try {
                await tracker.addProgress(owner.address, 1);
                assert.fail(0, 1, 'Exception not thrown');
            } catch (error) {
                expect(error.message).to.contain("doest not have any goals")
            }
        });
    })
});
