# Solidity Voting

A simple blockchain-based voting platform built using Solidity. This project allows an administrator to register voters and candidates, manage the voting session phases, and tally votes on-chain. Designed for use in Remix IDE.

## 🛠 Built With

- [Solidity](https://docs.soliditylang.org/)
- [Remix IDE](https://remix.ethereum.org/)
- [Ethers.js](https://docs.ethers.org/) (Frontend integration, optional)
- [React](https://reactjs.org/) (Frontend - if applicable)

---

## 📂 Features

- Admin-only access to:
  - Register candidates and voters
  - Manage voting session status
  - Start and end voting
  - Tally votes
- Voters can:
  - View the list of candidates
  - Cast a single vote
- Transparent and auditable election logic
- Events emitted for key actions (voter/candidate registration, votes, etc.)

---

## 🔧 Contract Structure

The main contract typically includes:

### Structs

- `Voter`: Stores if someone is registered and if they voted.
- `Candidate`: Stores candidate's name and vote count.

### Variables

- `owner`: Admin address
- `voters`: Mapping of address to `Voter`
- `candidates`: Array of `Candidate`
- `votingStatus`: Enum tracking voting phase

### Enums

- `WorkflowStatus`: 
  - RegisteringVoters
  - CandidatesRegistrationStarted
  - VotingSessionStarted
  - VotingSessionEnded
  - VotesTallied

### Key Functions

- `registerVoter(address voter)`
- `registerCandidate(string memory name)`
- `startVotingSession()`
- `vote(uint candidateIndex)`
- `endVotingSession()`
- `tallyVotes()`

---

## 🧪 How to Use (via Remix)

1. **Open Remix IDE**: https://remix.ethereum.org/

2. **Create a New File**:
   - Name it `Voting.sol`
   - Paste your contract code

3. **Compile**:
   - Use the Solidity compiler tab
   - Select appropriate compiler version (e.g., 0.8.x)

4. **Deploy**:
   - Go to the “Deploy & Run Transactions” tab
   - Choose “Injected Provider” (for MetaMask) or “Remix VM”
   - Deploy the contract

5. **Interact**:
   - Register voters and candidates
   - Start the voting session
   - Let voters vote
   - End the session and tally the votes

---

## 🖥 Frontend (Optional)

If you're building a frontend with **React + Ethers.js**:

- Connect MetaMask
- Fetch contract methods using ABI
- Handle state like:
  - Voter registered?
  - Has voted?
  - Candidates list
  - Vote status

Example of interaction (Ethers.js):
```js
const contract = new ethers.Contract(contractAddress, abi, signer);
await contract.vote(1); // votes for candidate at index 1
```

---



## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙋‍♂️ Author

**BNC Connect Bike Cedric**  
Feel free to reach out if you need help or want to contribute!
