//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

// TODO: Make tracker viable via fees or investments
contract HabitTracker {
    enum Status {
        ONGOING,
        COMPLETED,
        CANCELLED,
        FAILED
    }

    enum Category {
        MORE,
        LESS,
        TOTAL_MORE,
        TOTAL_LESS
    }

    event GoalCompleted(address indexed _from, string indexed _name);
    event GoalCancelled(address indexed _from, string indexed _name);
    event GoalFailed(address indexed _from, string indexed _name);
    event GoalStarted(address indexed _from, string indexed _name);

    struct Goal {
        string name;
        string description;
        Category category;
        uint256 progress;
        uint256 initial;
        uint256 target;
        string unit;
        uint256 deadline;
        uint256 bounty;
        Status status;
        uint256 createdOn;
    }

    mapping(address => mapping(string => Goal)) public goals;
    mapping(address => string[]) goalNames;
    address payable public company;

    // TODO: Add mapping(string => address) for user url display
    // TODO: Add a way to track statistics such as total amount staked, goals achieved, goals failed etc
    // TODO: Also, by keeping track of the total amount staked, the contract could periodically transfer it to the company

    constructor(address payable _company) {
        company = _company;
    }

    function createGoal(
        address _user,
        string memory _name,
        string memory _description,
        Category _category,
        uint256 _progress,
        uint256 _target,
        string memory _unit,
        uint256 _deadline
    ) public payable {
        require(bytes(_name).length != 0, "Goal name cannot be empty");
        require(msg.value > 0, "The goal bounty cannot be empty");
        require(goals[_user][_name].bounty == 0, "User already has a goal with that name");
        require(_deadline > block.timestamp, "A past goal cannot be created");
        require(!isGoalCompleted(_category, _progress, _target), "Goal is already completed");
        goals[_user][_name] = Goal(_name, _description, _category, _progress, _progress, _target, _unit, _deadline, msg.value, Status.ONGOING, block.timestamp);
        goalNames[_user].push(_name);
        emit GoalStarted(_user, _name);
    }

    // TODO: When integrations exists, other "users" should be able to add progress
    function addProgress(
        address _user,
        string memory _name,
        uint256 _value
    ) public onlyOwner(_user) onlyExistingGoal(_user, _name) {
        Category _category = goals[_user][_name].category;
        if (_category == Category.MORE) {
            goals[_user][_name].progress += _value;
        } else if (_category == Category.LESS) {
            goals[_user][_name].progress -= _value;
        } else {
            goals[_user][_name].progress = _value;
        }
    }

    function completeGoal(address payable _user, string memory _name) public onlyOwner(_user) onlyExistingGoal(_user, _name) onlyOngoingGoal(_user, _name) {
        Goal memory _goal = goals[_user][_name];
        require(isGoalCompleted(_goal.category, _goal.progress, _goal.target), "The goal has not been reached yet");
        _user.transfer(_goal.bounty);
        goals[_user][_name].status = Status.COMPLETED;
        emit GoalCompleted(_user, _name);
    }

    function failGoal(address payable _user, string memory _name) public onlyExistingGoal(_user, _name) onlyOngoingGoal(_user, _name) {
        Goal memory _goal = goals[_user][_name];
        require(isGoalOver(_goal.deadline) && !isGoalCompleted(_goal.category, _goal.progress, _goal.target), "The goal is still ongoing");
        company.transfer(_goal.bounty);
        goals[_user][_name].status = Status.FAILED;
        emit GoalFailed(_user, _name);
    }

    // TODO: When compound is integrated, a minimum length should be added to avoid contract gas fees injure
    function cancelGoal(address payable _user, string memory _name) public onlyOwner(_user) onlyExistingGoal(_user, _name) onlyOngoingGoal(_user, _name) {
        _user.transfer(goals[_user][_name].bounty);
        goals[_user][_name].status = Status.CANCELLED;
        emit GoalCancelled(_user, _name);
    }

    function getGoal(address payable _user, string memory _name) public view onlyExistingGoal(_user, _name) returns (Goal memory) {
        return goals[_user][_name];
    }

    function getGoals(address payable _user) public view returns (Goal[] memory) {
        uint256 _totalGoals = goalNames[_user].length;
        Goal[] memory _goals = new Goal[](_totalGoals);
        for (uint256 i = 0; i < _totalGoals; i++) {
            _goals[i] = goals[_user][goalNames[_user][i]];
        }
        return _goals;
    }

    function isGoalOver(uint256 _deadline) internal view returns (bool) {
        return block.timestamp > _deadline;
    }

    function isGoalCompleted(
        Category _category,
        uint256 _progress,
        uint256 _target
    ) internal pure returns (bool) {
        if (_category == Category.MORE || _category == Category.TOTAL_MORE) {
            return _progress >= _target;
        }
        return _progress <= _target;
    }

    modifier onlyOwner(address _user) {
        require(msg.sender == _user, "This function can only be called by the owner");
        _;
    }

    modifier onlyOngoingGoal(address _user, string memory _name) {
        require(goals[_user][_name].status == Status.ONGOING, "Goal must be ongoing");
        _;
    }

    modifier onlyExistingGoal(address _user, string memory _name) {
        require(goals[_user][_name].bounty != 0, "User does not have a goal with that name");
        _;
    }
}
