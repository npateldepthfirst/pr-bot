import { getRiskLevel, getRiskColorSolid } from '../utils/utilities';

interface RiskyRepositoryItemProps {
  repo: {
    name: string;
    risk_score?: number;
    analytics?: {
      risk_score: number;
    };
  };
  index: number;
  onRepositoryClick: (repo: any) => void;
}

export const RiskyRepositoryItem = ({ repo, index, onRepositoryClick }: RiskyRepositoryItemProps) => {
  const riskScore = repo.risk_score || repo.analytics?.risk_score || 0;
  
  return (
    <div 
      className="flex justify-between items-center bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 p-4 rounded-lg hover:shadow-md transition-all cursor-pointer hover:from-red-100 hover:to-orange-100"
      onClick={() => onRepositoryClick(repo)}
    >
      <div className="flex items-center space-x-3">
        <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
          {index + 1}
        </div>
        <span className="font-semibold text-gray-900">{repo.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Risk Score:</span>
        <span className={`px-3 py-1 rounded-full font-bold text-sm ${getRiskColorSolid(getRiskLevel(riskScore))}`}>
          {riskScore}
        </span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default RiskyRepositoryItem;
