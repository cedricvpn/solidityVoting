import { useState, useEffect, useCallback } from 'react';
import { Candidate, VotingContract } from '../utils/contractUtils';

interface VotingState {
  candidates: Candidate[];
  winner: { name: string; votes: number } | null;
  loading: boolean;
  error: string;
}

export const useVoting = (votingContract: VotingContract | null) => {
  const [votingState, setVotingState] = useState<VotingState>({
    candidates: [],
    winner: null,
    loading: false,
    error: '',
  });

  const loadCandidates = useCallback(async () => {
    if (!votingContract) return;
    
    try {
      setVotingState(prev => ({ ...prev, loading: true, error: '' }));
      const candidates = await votingContract.getCandidates();
      setVotingState(prev => ({ ...prev, candidates, loading: false }));
    } catch (error) {
      console.error('Error loading candidates:', error);
      setVotingState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load candidates',
      }));
    }
  }, [votingContract]);

  const loadWinner = useCallback(async () => {
    if (!votingContract) return;
    
    try {
      const winner = await votingContract.getWinner();
      setVotingState(prev => ({ ...prev, winner }));
    } catch (error) {
      console.error('Error loading winner:', error);
      // We don't set an error state here as this might fail if no votes have been cast
    }
  }, [votingContract]);

  const refreshData = useCallback(async () => {
    await Promise.all([loadCandidates(), loadWinner()]);
  }, [loadCandidates, loadWinner]);

  const addCandidate = async (name: string) => {
    if (!votingContract) return;
    
    try {
      setVotingState(prev => ({ ...prev, loading: true, error: '' }));
      const tx = await votingContract.addCandidate(name);
      await tx.wait();
      await refreshData();
    } catch (error) {
      console.error('Error adding candidate:', error);
      setVotingState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to add candidate',
      }));
      throw error;
    }
  };

  const allowVoter = async (address: string) => {
    if (!votingContract) return;
    
    try {
      setVotingState(prev => ({ ...prev, loading: true, error: '' }));
      const tx = await votingContract.allowVoter(address);
      await tx.wait();
      setVotingState(prev => ({ ...prev, loading: false }));
      return true;
    } catch (error) {
      console.error('Error allowing voter:', error);
      setVotingState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to allow voter',
      }));
      throw error;
    }
  };

  const vote = async (candidateIndex: number) => {
    if (!votingContract) return;
    
    try {
      setVotingState(prev => ({ ...prev, loading: true, error: '' }));
      const tx = await votingContract.vote(candidateIndex);
      await tx.wait();
      await refreshData();
      return true;
    } catch (error) {
      console.error('Error voting:', error);
      setVotingState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to vote',
      }));
      throw error;
    }
  };

  // Load data on component mount or when votingContract changes
  useEffect(() => {
    if (votingContract) {
      refreshData();
    }
  }, [votingContract, refreshData]);

  return {
    ...votingState,
    addCandidate,
    allowVoter,
    vote,
    refreshData,
  };
};