//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./HabitTracker.sol";

// TODO: Add discoverability
contract HabitSource {
    HabitTracker tracker;

    constructor (address _trackerAddress) {
        tracker = HabitTracker(_trackerAddress);
    }

    function addProgress(address to, uint256 progress) public {
        tracker.addProgress(to, progress);
    }

    // All sources (FitBit, Trello, GitHub...) are related to an activity
    function registerActivity() public {

    }
}
