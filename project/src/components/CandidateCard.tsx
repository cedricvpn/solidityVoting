import React from 'react';
import { Check, User } from 'lucide-react';
import { Candidate } from '../utils/contractUtils';

interface CandidateCardProps {
  candidate: Candidate;
  index: number;
  onVote: (index: number) => Promise<void>;
  isAllowedToVote: boolean;
  hasVoted: boolean;
  votedFor: number;
  loading: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  index,
  onVote,
  isAllowedToVote,
  hasVoted,
  votedFor,
  loading,
}) => {
  const isVotedFor = hasVoted && votedFor === index;
  
  return (
    <div 
      className={`card transition-all duration-300 ${
        isVotedFor ? 'ring-2 ring-primary-500 bg-primary-50' : ''
      }`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <User className="text-slate-700 w-5 h-5" />
            <h3 className="text-lg font-semibold">{candidate.name}</h3>
          </div>
          {isVotedFor && (
            <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" />
              Your Vote
            </span>
          )}
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-slate-500 mb-1">Votes</p>
          <p className="text-2xl font-bold text-slate-800">{candidate.voteCount}</p>
        </div>
        
        <button
          onClick={() => onVote(index)}
          disabled={!isAllowedToVote || hasVoted || loading}
          className={`btn w-full ${
            isVotedFor
              ? 'bg-primary-100 text-primary-800 cursor-default'
              : 'btn-primary'
          }`}
        >
          {isVotedFor ? 'Voted' : 'Vote'}
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;