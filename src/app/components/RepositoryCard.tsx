import { getRiskLevel, getRiskColor } from '../utils/utilities';

interface RepositoryCardProps {
  repo: {
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    analytics: {
      total_prs: number;
      open_prs_with_vulnerabilities: number;
      risk_score: number;
    };
  };
  onRepositoryClick: (repo: any) => void;
}

export const RepositoryCard = ({ repo, onRepositoryClick }: RepositoryCardProps) => (
  <div 
    className="border border-gray-200 p-6 rounded-lg hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-purple-50"
    onClick={() => onRepositoryClick(repo)}
  >
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="font-semibold text-lg text-gray-900">{repo.name}</h3>
        <p className="text-sm text-gray-600">{repo.full_name}</p>
      </div>
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
        repo.private 
          ? 'bg-purple-100 text-purple-800' 
          : 'bg-green-100 text-green-800'
      }`}>
        {repo.private ? 'Private' : 'Public'}
      </div>
    </div>
    
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Total PRs:</span>
        <span className="font-medium text-gray-900">{repo.analytics.total_prs}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Vulnerable PRs:</span>
        <span className="font-medium text-orange-600">{repo.analytics.open_prs_with_vulnerabilities}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Risk Score:</span>
        <span className={`font-bold px-2 py-1 rounded text-xs ${getRiskColor(getRiskLevel(repo.analytics.risk_score))}`}>
          {repo.analytics.risk_score}
        </span>
      </div>
    </div>
    
    <div className="mt-4 pt-3 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Click to view PRs</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </div>
);

export default RepositoryCard;
