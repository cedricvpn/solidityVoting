import React from 'react';
import { Wallet } from 'lucide-react';
import { shortenAddress } from '../utils/contractUtils';

interface WalletConnectProps {
  isConnected: boolean;
  address: string;
  onConnect: () => Promise<void>;
  error: string;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  isConnected,
  address,
  onConnect,
  error,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="flex items-center gap-2">
        <Wallet className="text-primary-600 w-5 h-5" />
        <span className="font-medium">Wallet Status:</span>
        {isConnected ? (
          <span className="text-green-600 font-medium">
            Connected ({shortenAddress(address)})
          </span>
        ) : (
          <span className="text-slate-500">Not Connected</span>
        )}
      </div>
      
      {!isConnected && (
        <button 
          onClick={onConnect}
          className="btn btn-primary w-full md:w-auto animate-pulse-slow"
        >
          Connect Wallet
        </button>
      )}
      
      {error && (
        <p className="text-red-500 text-sm mt-2 md:mt-0">
          {error}
        </p>
      )}
    </div>
  );
};

export default WalletConnect;