import React, { useState } from 'react';
import { Users, UserPlus, UserCheck, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminPanelProps {
  onAddCandidate: (name: string) => Promise<void>;
  onAllowVoter: (address: string) => Promise<boolean>;
  loading: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  onAddCandidate,
  onAllowVoter,
  loading,
}) => {
  const [candidateName, setCandidateName] = useState('');
  const [voterAddress, setVoterAddress] = useState('');
  
  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim()) return;
    
    try {
      await onAddCandidate(candidateName);
      toast.success(`Added candidate: ${candidateName}`);
      setCandidateName('');
    } catch (error) {
      toast.error('Failed to add candidate');
    }
  };
  
  const handleAllowVoter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voterAddress.trim()) return;
    
    try {
      await onAllowVoter(voterAddress);
      toast.success(`Voter authorized: ${voterAddress}`);
      setVoterAddress('');
    } catch (error) {
      toast.error('Failed to authorize voter');
    }
  };
  
  return (
    <div className="card p-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-6">
        <Users className="text-primary-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">Admin Panel</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="text-secondary-600 w-5 h-5" />
            <h3 className="text-lg font-medium">Add Candidate</h3>
          </div>
          
          <form onSubmit={handleAddCandidate} className="space-y-3">
            <div>
              <label htmlFor="candidateName" className="label">
                Candidate Name
              </label>
              <input
                id="candidateName"
                type="text"
                className="input"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Enter candidate name"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="btn btn-secondary w-full"
              disabled={loading || !candidateName.trim()}
            >
              Add Candidate
            </button>
          </form>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UserPlus className="text-accent-500 w-5 h-5" />
            <h3 className="text-lg font-medium">Authorize Voter</h3>
          </div>
          
          <form onSubmit={handleAllowVoter} className="space-y-3">
            <div>
              <label htmlFor="voterAddress" className="label">
                Wallet Address
              </label>
              <input
                id="voterAddress"
                type="text"
                className="input"
                value={voterAddress}
                onChange={(e) => setVoterAddress(e.target.value)}
                placeholder="0x..."
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="btn btn-accent w-full"
              disabled={loading || !voterAddress.trim()}
            >
              Authorize Voter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;