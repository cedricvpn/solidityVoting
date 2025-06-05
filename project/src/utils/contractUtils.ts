import { ethers } from 'ethers';

// Contract ABI (Application Binary Interface)
export const VotingABI = [
  "function admin() view returns (address)",
  "function candidates(uint) view returns (string name, uint voteCount)",
  "function voters(address) view returns (bool isAllowed, bool hasVoted, uint voteIndex)",
  "function addCandidate(string memory _name)",
  "function allowVoter(address _voter)",
  "function vote(uint _candidateIndex)",
  "function getCandidates() view returns (tuple(string name, uint voteCount)[] memory)",
  "function getWinner() view returns (string winnerName, uint winnerVotes)"
];

export interface Candidate {
  name: string;
  voteCount: number;
}

export interface Voter {
  isAllowed: boolean;
  hasVoted: boolean;
  voteIndex: number;
}

export class VotingContract {
  private contract: ethers.Contract;
  private provider: ethers.providers.Web3Provider;
  private signer: ethers.Signer;

  constructor(contractAddress: string, provider: ethers.providers.Web3Provider) {
    this.provider = provider;
    this.signer = provider.getSigner();
    this.contract = new ethers.Contract(contractAddress, VotingABI, this.signer);
  }

  async getAdmin(): Promise<string> {
    return await this.contract.admin();
  }

  async getCandidates(): Promise<Candidate[]> {
    const candidatesRaw = await this.contract.getCandidates();
    return candidatesRaw.map((candidate: any) => ({
      name: candidate.name,
      voteCount: candidate.voteCount.toNumber()
    }));
  }

  async getVoterStatus(address: string): Promise<Voter> {
    const voterRaw = await this.contract.voters(address);
    return {
      isAllowed: voterRaw.isAllowed,
      hasVoted: voterRaw.hasVoted,
      voteIndex: voterRaw.voteIndex.toNumber()
    };
  }

  async addCandidate(name: string): Promise<ethers.ContractTransaction> {
    return await this.contract.addCandidate(name);
  }

  async allowVoter(voterAddress: string): Promise<ethers.ContractTransaction> {
    return await this.contract.allowVoter(voterAddress);
  }

  async vote(candidateIndex: number): Promise<ethers.ContractTransaction> {
    return await this.contract.vote(candidateIndex);
  }

  async getWinner(): Promise<{ name: string; votes: number }> {
    const [name, votes] = await this.contract.getWinner();
    return {
      name,
      votes: votes.toNumber()
    };
  }
}

export const connectWallet = async (): Promise<{ 
  provider: ethers.providers.Web3Provider;
  address: string;
}> => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask to use this application");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const address = await signer.getAddress();

  return { provider, address };
};

export const shortenAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};