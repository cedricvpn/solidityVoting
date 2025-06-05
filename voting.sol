// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public admin;

    struct Candidate {
        string name;
        uint voteCount;
    }

    struct Voter {
        bool isAllowed;
        bool hasVoted;
        uint voteIndex;
    }

    Candidate[] public candidates;
    mapping(address => Voter) public voters;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function addCandidate(string memory _name) public onlyAdmin {
        candidates.push(Candidate(_name, 0));
    }

    function allowVoter(address _voter) public onlyAdmin {
        voters[_voter].isAllowed = true;
    }

    function vote(uint _candidateIndex) public {
        Voter storage sender = voters[msg.sender];
        require(sender.isAllowed, "You are not allowed to vote");
        require(!sender.hasVoted, "You have already voted");
        require(_candidateIndex < candidates.length, "Invalid candidate");

        sender.hasVoted = true;
        sender.voteIndex = _candidateIndex;

        candidates[_candidateIndex].voteCount += 1;
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getWinner() public view returns (string memory winnerName, uint winnerVotes) {
        uint maxVotes = 0;
        uint winnerIndex;

        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerIndex = i;
            }
        }

        return (candidates[winnerIndex].name, candidates[winnerIndex].voteCount);
    }
}
