//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// TODO: Add the possibility to have negative goals (smoke less)
// TODO: Add the possibility to have boolean goals. This makes sense if frequency feature is implemented
// TODO: Maybe adding a fee is a good idea
// TODO: Check how to invest the contract money to generate interests for the users
contract HabitTracker {
    enum Status {
        ONGOING,
        COMPLETED,
        CANCELLED,
        FAILED
    }

    enum Category {
        MORE,
        LESS
    }

    event GoalCompleted(address indexed _from, string indexed _name);
    event GoalCancelled(address indexed _from, string indexed _name);
    event GoalFailed(address indexed _from, string indexed _name);
    event GoalStarted(address indexed _from, string indexed _name);

    struct Goal {
        string name;
        Category category;
        uint256 progress;
        uint256 target;
        string unit;
        uint256 deadline;
        uint256 stake;
        Status status;
    }

    mapping(address => mapping(string => Goal)) public goals;
    address payable public company;

    constructor(address payable _company) {
        company = _company;
    }

    function createGoal(
        address _user,
        string memory _name,
        Category _category,
        uint256 _progress,
        uint256 _target,
        string memory _unit,
        uint256 _deadline
    ) public payable onlyNewGoal(_user, _name) onlyValidName(_name) onlyMinimumStake(msg.value) onlyFutureGoal(_deadline) {
        goals[_user][_name] = Goal(_name, _category, _progress, _target, _unit, _deadline, msg.value, Status.ONGOING);
        emit GoalStarted(_user, _name);
    }

    // TODO: Consider that when integrations exists, maybe we want to block the user from upgrading their own goal manually
    function addProgress(
        address _user,
        string memory _name,
        uint256 _value
    ) public onlyOwner(_user) onlyExistingGoal(_user, _name) {
        goals[_user][_name].progress += _value;
    }

    function completeGoal(address payable _user, string memory _name)
        public
        onlyOwner(_user)
        onlyExistingGoal(_user, _name)
        onlyOngoingGoal(_user, _name)
        onlyCompletedGoal(_user, _name)
    {
        _user.transfer(goals[_user][_name].stake);
        goals[_user][_name].status = Status.COMPLETED;
        emit GoalCompleted(_user, _name);
    }

    function failGoal(address payable _user, string memory _name)
        public
        onlyExistingGoal(_user, _name)
        onlyOngoingGoal(_user, _name)
        onlyFailedGoal(_user, _name)
    {
        goals[_user][_name].status = Status.FAILED;
        company.transfer(goals[_user][_name].stake);
        emit GoalFailed(_user, _name);
    }

    function cancelGoal(address payable _user, string memory _name) public onlyOwner(_user) onlyExistingGoal(_user, _name) onlyOngoingGoal(_user, _name) {
        _user.transfer(goals[_user][_name].stake);
        goals[_user][_name].status = Status.CANCELLED;
        emit GoalCancelled(_user, _name);
    }

    function getGoal(address payable _user, string memory _name) public view onlyExistingGoal(_user, _name) returns (Goal memory) {
        return goals[_user][_name];
    }

    function isGoalOver(address _user, string memory _name) internal view returns (bool) {
        return block.timestamp > goals[_user][_name].deadline;
    }

    function isGoalCompleted(address _user, string memory _name) internal view returns (bool) {
        return goals[_user][_name].progress >= goals[_user][_name].target;
    }

    modifier onlyOwner(address _user) {
        require(msg.sender == _user, "This function can only be called by the owner");
        _;
    }

    modifier onlyCompletedGoal(address _user, string memory _name) {
        require(isGoalCompleted(_user, _name), "The goal has not been reached yet");
        _;
    }

    modifier onlyOngoingGoal(address _user, string memory _name) {
        require(goals[_user][_name].status == Status.ONGOING, "Goal must be ongoing");
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
        require(amount > 0, "The goal stake cannot be empty");
        _;
    }

    modifier onlyFutureGoal(uint256 _deadline) {
        require(_deadline > block.timestamp, "A past goal cannot be created");
        _;
    }

    modifier onlyValidName(string memory _name) {
        require(bytes(_name).length != 0, "Name cannot be empty");
        _;
    }

    modifier onlyFailedGoal(address _user, string memory _name) {
        require(!isGoalCompleted(_user, _name) && isGoalOver(_user, _name), "The goal is still ongoing");
        _;
    }
}
