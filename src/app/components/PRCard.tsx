import React from 'react';
import { PullRequest } from '../stores/githubInfoStore';
import { getRiskColor as getBaseRiskColor } from '../utils/utilities';

interface PRCardProps {
  pr: PullRequest & { originalRepository?: string; originalRepositoryUrl?: string };
  repositoryName: string;
}

const getRiskColor = (riskLevel: string) => {
  const baseColor = getBaseRiskColor(riskLevel);
  const borderColor = riskLevel === 'Critical' ? 'border-red-200' :
                     riskLevel === 'High' ? 'border-orange-200' :
                     riskLevel === 'Medium' ? 'border-yellow-200' :
                     riskLevel === 'Low' ? 'border-blue-200' :
                     'border-gray-200';
  return `${baseColor} ${borderColor}`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Needs Review':
      return 'bg-yellow-100 text-yellow-800';
    case 'Resolved':
      return 'bg-green-100 text-green-800';
    case 'Fix in Progress':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStateColor = (state: string) => {
  return state === 'open' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-gray-100 text-gray-800';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const PRCard: React.FC<PRCardProps> = ({ pr, repositoryName }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
            {pr.title}
          </h3>
          <p className="text-xs text-gray-500 mb-2">
            #{pr.number} in {pr.originalRepository || repositoryName}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStateColor(pr.state)}`}>
            {pr.state}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pr.resolution_status)}`}>
            {pr.resolution_status}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <img
            src={pr.user.avatar_url}
            alt={pr.user.login}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-600">{pr.user.login}</span>
          {pr.originalRepository && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {pr.originalRepository}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500">
          {formatDate(pr.created_at)}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-green-600 font-medium">
            +{pr.additions}
          </span>
          <span className="text-red-600 font-medium">
            -{pr.deletions}
          </span>
          <span className="text-gray-500">
            {pr.security_analysis.length} vulnerabilities
          </span>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-bold border ${getRiskColor(pr.risk_level)}`}>
          Risk: {pr.risk_score}
        </div>
      </div>

      {pr.security_analysis.length > 0 && (
        <div className="border-t pt-3">
          <div className="flex flex-wrap gap-1">
            {pr.security_analysis.map((analysis) => (
              <span
                key={analysis.id}
                className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(analysis.severity)}`}
              >
                {analysis.severity}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t">
        <a
          href={pr.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View on GitHub →
        </a>
      </div>
    </div>
  );
};
