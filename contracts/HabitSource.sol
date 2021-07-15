//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./HabitTracker.sol";

// TODO: Add discoverability
// TODO: This probably should be an interface
contract HabitSource {
    HabitTracker tracker;

    constructor(address _trackerAddress) {
        tracker = HabitTracker(_trackerAddress);
    }

    function addProgress(address to, uint256 progress) public {}

    // All sources (FitBit, Trello, GitHub...) are related to an activity
    function registerActivity() public {}
}
