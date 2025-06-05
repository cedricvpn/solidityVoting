import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { VotingContract, connectWallet } from '../utils/contractUtils';

interface WalletState {
  isConnected: boolean;
  address: string;
  isAdmin: boolean;
  votingContract: VotingContract | null;
  provider: ethers.providers.Web3Provider | null;
  isAllowedToVote: boolean;
  hasVoted: boolean;
  votedFor: number;
  error: string;
}

export const useWallet = (contractAddress: string) => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: '',
    isAdmin: false,
    votingContract: null,
    provider: null,
    isAllowedToVote: false,
    hasVoted: false,
    votedFor: 0,
    error: '',
  });

  const connectToWallet = async () => {
    try {
      // Validate contract address before proceeding
      if (!contractAddress || !ethers.utils.isAddress(contractAddress)) {
        throw new Error('Invalid or missing contract address');
      }

      setWalletState(prev => ({ ...prev, error: '' }));
      const { provider, address } = await connectWallet();

      // Create contract instance
      const votingContract = new VotingContract(contractAddress, provider);
      
      // Verify contract exists by calling a view function
      try {
        await votingContract.getAdmin();
      } catch (error) {
        throw new Error('Could not connect to contract. Please make sure you are connected to the correct network.');
      }

      const admin = await votingContract.getAdmin();
      const isAdmin = address.toLowerCase() === admin.toLowerCase();
      
      // Get voter status
      const voterStatus = await votingContract.getVoterStatus(address);
      
      setWalletState({
        isConnected: true,
        address,
        isAdmin,
        votingContract,
        provider,
        isAllowedToVote: voterStatus.isAllowed,
        hasVoted: voterStatus.hasVoted,
        votedFor: voterStatus.voteIndex,
        error: '',
      });
      
      return { votingContract, address };
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setWalletState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to connect to wallet',
      }));
      return null;
    }
  };

  const refreshVoterStatus = async () => {
    if (!walletState.votingContract || !walletState.address) return;
    
    try {
      const voterStatus = await walletState.votingContract.getVoterStatus(walletState.address);
      
      setWalletState(prev => ({
        ...prev,
        isAllowedToVote: voterStatus.isAllowed,
        hasVoted: voterStatus.hasVoted,
        votedFor: voterStatus.voteIndex,
      }));
    } catch (error) {
      console.error('Error refreshing voter status:', error);
    }
  };

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      // Only attempt connection if we have both MetaMask and a valid contract address
      if (
        window.ethereum && 
        window.ethereum.selectedAddress && 
        contractAddress && 
        ethers.utils.isAddress(contractAddress)
      ) {
        await connectToWallet();
      }
    };
    
    checkConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        // Only reconnect if we have a valid contract address
        if (contractAddress && ethers.utils.isAddress(contractAddress)) {
          connectToWallet();
        }
      });
      
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, [contractAddress]);

  return {
    ...walletState,
    connectToWallet,
    refreshVoterStatus,
  };
};