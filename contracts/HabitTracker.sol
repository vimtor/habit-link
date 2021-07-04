//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// TODO: Maybe adding the ability to add to which user should the money go back so people can work towards something
// TODO: Maybe adding the ability to have several contribute towards a goal
// TODO: Maybe take gas into account so users don't lose anything but then a fee to cover the gas or a minimum goal length should be added
// TODO: Add the possibility to have negative goals (smoke less)
// TODO: Add the possibility to have boolean goals. This makes sense if frequency feature is implemented
// TODO: Maybe adding a fee is a good idea
// TODO: Check how to invest the contract money to generate interests for the users
contract HabitTracker {
    // TODO: Do something with the frequency
    // enum Frequency {NONE,DAILY, WEEKLY, MONTHLY, YEARLY}

    enum Status {
        ONGOING,
        COMPLETED,
        CANCELLED,
        FAILED
    }

    // TODO: Investigate why events are useful and what are their gas implications
    // event GoalCompleted(address indexed _from, string indexed _name);
    // event GoalCancelled(address indexed _from, string indexed _name);
    // event GoalFailed(address indexed _from, string indexed _name);
    // event GoalStarted(address indexed _from, string indexed _name);

    struct Goal {
        string name;
        uint256 target;
        string unit;
        uint256 deadline;
        uint256 stake;
        uint256 progress;
        Status status;
    }

    // TODO: Investigate scalability issues, maybe a mapping(address => mapping(string => Goal)) is more efficient when arrays are large.
    //       Probably the above makes sense since most of the reads are using the "findGoalIndex" function
    mapping(address => Goal[]) goals;

    function createGoal(
        address _user,
        string memory _name,
        uint256 _target,
        uint256 _deadline,
        string memory _unit
    ) public payable {
        // TODO: Extract domain logic into functions (isGoalCompleted, isGoalFinished...)
        require(_deadline > block.timestamp, "A past goal cannot be created");
        require(!doesGoalExists(_user, _name), "User already has a goal with that name");
        // TODO: Probably a higher minimum will be required if funds are split in some way
        require(msg.value > 0, "The goal stake cannot be empty");

        Goal memory _goal = Goal(_name, _target, _unit, _deadline, msg.value, 0, Status.ONGOING);
        goals[_user].push(_goal);
    }

    // TODO: Function to motivate a user further
    function increaseStake(address _user, string memory _name) public payable goalExists(_user, _name) {
        uint256 _index = findGoalIndex(_user, _name);
        goals[_user][_index].stake += msg.value;
    }

    // TODO: Add the option to progress other user habit? In edge cases (money being lost or person died)
    // TODO: Consider that when integrations exists, maybe we want to block the user from upgrading their own goal manually
    function addProgress(
        address _user,
        string memory _name,
        uint256 _value
    ) public goalExists(_user, _name) onlyOwner(_user) {
        uint256 _index = findGoalIndex(_user, _name);
        goals[_user][_index].progress += _value;
        // TODO: Check if habit has been completed
    }

    function completeGoal(address payable _user, string memory _name) public goalExists(_user, _name) onlyOwner(_user) {
        uint256 _index = findGoalIndex(_user, _name);
        Goal memory goal = goals[_user][_index];
        require(goal.progress >= goal.target);
        _user.transfer(goal.stake);
        goals[_user][_index].status = Status.COMPLETED;
    }

    function failGoal(address payable _user, string memory _name) public goalExists(_user, _name) onlyOwner(_user) {
        uint256 _index = findGoalIndex(_user, _name);
        Goal memory goal = goals[_user][_index];
        require(goal.progress < goal.target && goal.deadline < block.timestamp);
        goals[_user][_index].status = Status.FAILED;
        // TODO: Do something with the remaining funds
    }

    // TODO: Add the notion of an non-cancellable goal
    function cancelGoal(address payable _user, string memory _name) public goalExists(_user, _name) {
        uint256 _index = findGoalIndex(_user, _name);
        Goal memory goal = goals[_user][_index];
        _user.transfer(goal.stake);
        goals[_user][_index].status = Status.CANCELLED;
    }

    function getGoal(address payable _user, string memory _name) public view goalExists(_user, _name) returns (Goal memory) {
        uint256 _index = findGoalIndex(_user, _name);
        return goals[_user][_index];
    }

    function getGoals(address payable _user) public view onlyOwner(_user) returns (Goal[] memory) {
        return goals[_user];
    }

    // Probably this function will be called by a cron job or a generous user
    function checkGoals(address payable _user) public {
        for (uint256 i = 0; i < goals[_user].length; i++) {
            Goal memory _goal = goals[_user][i];
            // TODO: Investigate and add an error factor margin
            bool isGoalFinished = block.timestamp > _goal.deadline;
            bool isGoalSucceeded = _goal.progress >= _goal.stake;
            if (isGoalSucceeded) {
                completeGoal(_user, _goal.name);
            } else if (isGoalFinished) {
                failGoal(_user, _goal.name);
            }
        }
    }

    modifier onlyOwner(address _user) {
        require(msg.sender == _user, "This function can only be called by the owner");
        _;
    }

    modifier goalExists(address _user, string memory _name) {
        require(goals[_user].length > 0, "User does not have any goals");
        require(doesGoalExists(_user, _name), "User does not have a goal with that name");
        _;
    }

    function areEqual(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b)));
    }

    function doesGoalExists(address _user, string memory _name) internal view returns (bool) {
        for (uint256 i = 0; i < goals[_user].length; i++) {
            if (areEqual(goals[_user][i].name, _name)) {
                return true;
            }
        }
        return false;
    }

    function findGoalIndex(address _user, string memory _name) internal view returns (uint256) {
        for (uint256 i = 0; i < goals[_user].length; i++) {
            if (areEqual(goals[_user][i].name, _name)) {
                return i;
            }
        }
        return 0;
    }
}
