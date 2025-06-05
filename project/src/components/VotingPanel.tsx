import React from 'react';
import { Vote } from 'lucide-react';
import CandidateCard from './CandidateCard';
import { Candidate } from '../utils/contractUtils';
import toast from 'react-hot-toast';

interface VotingPanelProps {
  candidates: Candidate[];
  onVote: (candidateIndex: number) => Promise<boolean>;
  isAllowedToVote: boolean;
  hasVoted: boolean;
  votedFor: number;
  loading: boolean;
}

const VotingPanel: React.FC<VotingPanelProps> = ({
  candidates,
  onVote,
  isAllowedToVote,
  hasVoted,
  votedFor,
  loading,
}) => {
  const handleVote = async (candidateIndex: number) => {
    try {
      await onVote(candidateIndex);
      toast.success(`Vote cast successfully!`);
    } catch (error) {
      toast.error('Failed to cast vote');
    }
  };
  
  return (
    <div className="card p-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-6">
        <Vote className="text-primary-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Cast Your Vote</h2>
      </div>
      
      {!isAllowedToVote && !hasVoted && (
        <div className="bg-amber-50 text-amber-800 p-4 rounded-lg mb-6 border border-amber-100">
          <p className="font-medium">You are not authorized to vote</p>
          <p className="text-sm mt-1">Please contact the admin to get voting rights.</p>
        </div>
      )}
      
      {hasVoted && (
        <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6 border border-green-100">
          <p className="font-medium">You have already voted</p>
          <p className="text-sm mt-1">Thank you for participating in this election.</p>
        </div>
      )}
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map((candidate, index) => (
          <CandidateCard 
            key={index}
            candidate={candidate}
            index={index}
            onVote={handleVote}
            isAllowedToVote={isAllowedToVote}
            hasVoted={hasVoted}
            votedFor={votedFor}
            loading={loading}
          />
        ))}
        
        {candidates.length === 0 && (
          <div className="col-span-full text-center py-10 text-slate-500">
            <p>No candidates have been added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingPanel;