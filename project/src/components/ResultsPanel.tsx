import React from 'react';
import { Award, BarChart } from 'lucide-react';
import { Candidate } from '../utils/contractUtils';

interface ResultsPanelProps {
  candidates: Candidate[];
  winner: { name: string; votes: number } | null;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ candidates, winner }) => {
  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);
  
  // Sort candidates by vote count (descending)
  const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount);
  
  return (
    <div className="card p-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-6">
        <BarChart className="text-primary-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Results</h2>
      </div>
      
      {winner && winner.votes > 0 && (
        <div className="mb-6 bg-gradient-to-r from-secondary-50 to-primary-50 p-4 rounded-lg border border-primary-100">
          <div className="flex items-center gap-2 mb-2">
            <Award className="text-accent-500 w-5 h-5" />
            <h3 className="text-lg font-medium">Current Winner</h3>
          </div>
          <p className="text-2xl font-bold text-slate-800">{winner.name}</p>
          <p className="text-sm text-slate-500">
            with {winner.votes} vote{winner.votes !== 1 ? 's' : ''}
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        <p className="text-sm text-slate-500">
          Total Votes Cast: <span className="font-medium">{totalVotes}</span>
        </p>
        
        {sortedCandidates.map((candidate, index) => {
          const percentage = totalVotes > 0 
            ? Math.round((candidate.voteCount / totalVotes) * 100) 
            : 0;
          
          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">{candidate.name}</span>
                <span className="text-sm">
                  {candidate.voteCount} vote{candidate.voteCount !== 1 ? 's' : ''} ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsPanel;