// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public admin;

    struct Candidate {
        string name;
        uint voteCount;
    }

    Candidate[] public candidates;

    mapping(address => Voter) public voters;

    struct Voter {
        bool isAllowed;
        bool hasVoted;
        uint voteIndex;
    }

    constructor() {
        admin = msg.sender;
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getWinner() public view returns (string memory, uint) {
        uint maxVotes = 0;
        uint winnerIndex = 0;
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerIndex = i;
            }
        }
        return (candidates[winnerIndex].name, candidates[winnerIndex].voteCount);
    }

    function addCandidate(string memory _name) public {
        require(msg.sender == admin, "Only admin can add");
        candidates.push(Candidate(_name, 0));
    }

    function allowVoter(address _voter) public {
        require(msg.sender == admin, "Only admin can allow");
        voters[_voter].isAllowed = true;
    }

    function vote(uint _index) public {
        require(voters[msg.sender].isAllowed, "Not allowed");
        require(!voters[msg.sender].hasVoted, "Already voted");
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].voteIndex = _index;
        candidates[_index].voteCount += 1;
    }

    function votersStatus(address _addr) public view returns (bool, bool, uint) {
        Voter memory v = voters[_addr];
        return (v.isAllowed, v.hasVoted, v.voteIndex);
    }
}
