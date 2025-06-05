import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AlertTriangle, Vote } from 'lucide-react';
import WalletConnect from './components/WalletConnect';
import AdminPanel from './components/AdminPanel';
import VotingPanel from './components/VotingPanel';
import ResultsPanel from './components/ResultsPanel';
import { useWallet } from './hooks/useWallet';
import { useVoting } from './hooks/useVoting';

function App() {
  const [contractAddress] = useState<string>('0x92859261aFE2d31b3321D3db8686A87D1B141468');
  
  const {
    isConnected,
    address,
    isAdmin,
    votingContract,
    isAllowedToVote,
    hasVoted,
    votedFor,
    error: walletError,
    connectToWallet,
    refreshVoterStatus,
  } = useWallet(contractAddress);
  
  const {
    candidates,
    winner,
    loading,
    error: votingError,
    addCandidate,
    allowVoter,
    vote,
    refreshData,
  } = useVoting(votingContract);
  
  const handleVote = async (candidateIndex: number) => {
    const success = await vote(candidateIndex);
    if (success) {
      await refreshVoterStatus();
    }
    return success;
  };
  
  const handleAllowVoter = async (voterAddress: string) => {
    const success = await allowVoter(voterAddress);
    if (success && voterAddress.toLowerCase() === address.toLowerCase()) {
      await refreshVoterStatus();
    }
    return success;
  };
  
  const handleRefresh = async () => {
    await Promise.all([refreshData(), refreshVoterStatus()]);
  };
  
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6 shadow-md">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Vote className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Blockchain Voting System</h1>
            </div>
            
            {isConnected && (
              <button 
                onClick={handleRefresh}
                className="btn btn-sm bg-white/10 hover:bg-white/20 text-white border-white/20"
                disabled={loading}
              >
                Refresh Data
              </button>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 space-y-6">
        <WalletConnect
          isConnected={isConnected}
          address={address}
          onConnect={async () => {
            const result = await connectToWallet();
            return result ? undefined : Promise.resolve();
          }}
          error={walletError}
        />
        
        {(walletError || votingError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{walletError || votingError}</p>
            </div>
          </div>
        )}
        
        {isConnected && isAdmin && (
          <AdminPanel
            onAddCandidate={addCandidate}
            onAllowVoter={async (voterAddress: string) => {
              const success = await handleAllowVoter(voterAddress);
              return success === true; // Ensure it returns a boolean
            }}
            loading={loading}
          />
        )}
        
        {isConnected && (
          <div className="grid md:grid-cols-2 gap-6">
            <VotingPanel
              candidates={candidates}
              onVote={async (candidateIndex: number) => {
                const result = await handleVote(candidateIndex);
                return result === true; // Ensure it returns a boolean
              }}
              isAllowedToVote={isAllowedToVote}
              hasVoted={hasVoted}
              votedFor={votedFor}
              loading={loading}
            />
            
            <ResultsPanel
              candidates={candidates}
              winner={winner}
            />
          </div>
        )}
      </main>
      
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;