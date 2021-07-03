//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// TODO: Maybe adding the ability to add to which user should the money go back so people can work towards something
// TODO: Maybe adding the ability to have several contribute towards a goal
// TODO: Maybe take gas into account so users don't lose anything but then a fee to cover the gas or a minimum goal length should be added
// TODO: Add the possibility to have negative goals (smoke less)
// TODO: Add the possibility to have boolean goals
// TODO: For integrations create an interface for others to implement (contract GoogleFit is HabitSource)
// TODO: Maybe adding a fee is a good idea
// TODO: Check how to invest the contract money to generate interests for the users
contract HabitTracker {
    // TODO: Do something with the frequency
    enum Frequency {DAILY, WEEKLY, MONTHLY, YEARLY}

    // TODO: Probably rename to Habit
    struct Goal {
        string name;
        uint256 target;
        string unit;
        uint256 deadline;
        uint256 stake;
        uint256 progress;
    }

    // TODO: Investigate why events are useful and what are their gas implications
    event GoalCompleted(address indexed _from, string indexed _name);
    event GoalCancelled(address indexed _from, string indexed _name);
    event GoalFailed(address indexed _from, string indexed _name);
    event GoalStarted(address indexed _from, string indexed _name);

    // TODO: Add the ability to have more than 1 goal per address
    mapping(address => Goal) goals;

    function createGoal(string memory _name, uint256 _target, uint256 _deadline, string memory _unit) payable public {
        // TODO: Check that goal is not being overridden
        require(_deadline > block.timestamp, "A past goal cannot be created");
        goals[msg.sender] = Goal(_name, _target, _unit, _deadline, msg.value, 0);
    }

    // TODO: Function to motivate a user further
    // Consider blocking the method of verification so the original user doesn't get the money and run
    function increaseStake(address _user) hasGoals(_user) payable public {
        goals[_user].stake += msg.value;
    }

    // TODO: Add the option to progress other user habit? In edge cases (money being lost or person died)
    function addProgress(address _user, uint256 value) hasGoals(_user) onlyOwner(_user) public {
        goals[_user].progress += value;
        // TODO: Check if habit has been completed
    }

    // TODO: Add notion of privacy?
    function getProgress(address payable _user) onlyOwner(_user) view public returns (uint256) {
        return goals[msg.sender].progress;
    }

    function completeGoal(address payable _user) hasGoals(_user) onlyOwner(_user) public {
        Goal memory goal = goals[_user];
        // TODO: Move to a modifier
        require(goal.progress >= goal.target);
        _user.transfer(goal.stake);
    }

    function failGoal(address payable _user) hasGoals(_user) onlyOwner(_user) public {
        Goal memory goal = goals[_user];
        // TODO: Move to a modifier
        require(goal.progress < goal.target && goal.deadline < block.timestamp);
        // TODO: Probably makes more sense _user have the goal as an state machine (FAILED)
        // TODO: Either way maybe removing it is a good idea for memory concerns
        delete goals[_user];
        // TODO: Do something with the remaining funds
    }

    // TODO: Add the notion of an non-cancellable goal
    function cancelGoal(address payable _user) hasGoals(_user) public {
        Goal memory goal = goals[_user];
        _user.transfer(goal.stake);
        // TODO: Probably makes more sense to have the goal as an state machine (CANCELLED)
        delete goals[_user];
    }

    // Probably this function will be called by a cron job or a generous user
    function checkGoals(address payable _user) hasGoals(_user) public {
        Goal memory goal = goals[_user];

        // TODO: Investigate and add an error factor margin
        bool isGoalFinished = block.timestamp > goal.deadline;
        bool isGoalSucceeded = goal.progress >= goal.stake;

        if (isGoalSucceeded) {
            completeGoal(_user);
        } else if (isGoalFinished) {
            failGoal(_user);
        }
    }

    modifier onlyOwner(address owner) {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier hasGoals(address owner) {
        // TODO: Actually implement
        require(true, "User doest not have any goals");
        _;
    }
}
