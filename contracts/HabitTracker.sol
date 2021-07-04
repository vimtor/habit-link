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

    mapping(address => mapping(string => Goal)) goals;

    function createGoal(
        address _user,
        string memory _name,
        uint256 _target,
        uint256 _deadline,
        string memory _unit
    ) public payable onlyNewGoal(_user, _name) onlyMinimumStake(msg.value) onlyFutureGoal(_deadline) {
        goals[_user][_name] = Goal(_name, _target, _unit, _deadline, msg.value, 0, Status.ONGOING);
    }

    // TODO: Function to motivate a user further
    function increaseStake(address _user, string memory _name) public payable onlyExistingGoal(_user, _name) {
        goals[_user][_name].stake += msg.value;
    }

    // TODO: Add the option to progress other user habit? In edge cases (money being lost or person died)
    // TODO: Consider that when integrations exists, maybe we want to block the user from upgrading their own goal manually
    function addProgress(
        address _user,
        string memory _name,
        uint256 _value
    ) public onlyExistingGoal(_user, _name) onlyOwner(_user) {
        goals[_user][_name].progress += _value;
        // TODO: Check if habit has been completed
    }

    function completeGoal(address payable _user, string memory _name) public onlyExistingGoal(_user, _name) onlyOwner(_user) {
        Goal memory goal = goals[_user][_name];
        require(goal.progress >= goal.target, "The goal has not been reached yet");
        _user.transfer(goal.stake);
        goals[_user][_name].status = Status.COMPLETED;
    }

    function failGoal(address payable _user, string memory _name) public onlyExistingGoal(_user, _name) onlyOwner(_user) {
        Goal memory goal = goals[_user][_name];
        require(goal.progress < goal.target && goal.deadline < block.timestamp);
        goals[_user][_name].status = Status.FAILED;
        // TODO: Do something with the remaining funds
    }

    // TODO: Add the notion of an non-cancellable goal
    function cancelGoal(address payable _user, string memory _name) public onlyExistingGoal(_user, _name) {
        _user.transfer(goals[_user][_name].stake);
        goals[_user][_name].status = Status.CANCELLED;
    }

    function getGoal(address payable _user, string memory _name) public view onlyExistingGoal(_user, _name) returns (Goal memory) {
        return goals[_user][_name];
    }

    // Probably this function will be called by a cron job or a generous user
    function checkGoal(address payable _user, string memory _name) public {
        Goal memory _goal = goals[_user][_name];
        bool isGoalFinished = block.timestamp > _goal.deadline;
        bool isGoalSucceeded = _goal.progress >= _goal.stake;
        if (isGoalSucceeded) {
            completeGoal(_user, _name);
        } else if (isGoalFinished) {
            failGoal(_user, _name);
        }
    }

    modifier onlyOwner(address _user) {
        require(msg.sender == _user, "This function can only be called by the owner");
        _;
    }

    modifier onlyExistingGoal(address _user, string memory _name) {
        require(goals[_user][_name].stake != 0, "User does not have a goal with that name");
        _;
    }

    modifier onlyNewGoal(address _user, string memory _name) {
        require(goals[_user][_name].stake == 0, "User already has a goal with that name");
        _;
    }

    modifier onlyMinimumStake(uint256 amount) {
        // TODO: Probably a higher minimum will be required if funds are split in some way
        require(amount > 0, "The goal stake cannot be empty");
        _;
    }

    modifier onlyFutureGoal(uint256 _deadline) {
        require(_deadline > block.timestamp, "A past goal cannot be created");
        _;
    }
}
