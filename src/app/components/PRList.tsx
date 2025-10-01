import React from 'react';
import { PullRequest } from '../stores/githubInfoStore';
import { PRCard } from './PRCard';

interface PRListProps {
  pullRequests: PullRequest[];
  repositoryName: string;
  isLoading?: boolean;
}

const getSortOrder = (riskLevel: string) => {
  switch (riskLevel) {
    case 'Critical': return 4;
    case 'High': return 3;
    case 'Medium': return 2;
    case 'Low': return 1;
    default: return 0;
  }
};

const sortPRsByRisk = (prs: PullRequest[]) => {
  return [...prs].sort((a, b) => {
    // First sort by risk level
    const riskOrderA = getSortOrder(a.risk_level);
    const riskOrderB = getSortOrder(b.risk_level);
    
    if (riskOrderA !== riskOrderB) {
      return riskOrderB - riskOrderA; // Higher risk first
    }
    
    // Then by risk score
    if (a.risk_score !== b.risk_score) {
      return b.risk_score - a.risk_score; // Higher score first
    }
    
    // Finally by creation date (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};

const getFilterOptions = (prs: PullRequest[]) => {
  const states = [...new Set(prs.map(pr => pr.state))];
  const statuses = [...new Set(prs.map(pr => pr.resolution_status))];
  const riskLevels = [...new Set(prs.map(pr => pr.risk_level))].sort((a, b) => {
    const order = ['Critical', 'High', 'Medium', 'Low', 'None'];
    return order.indexOf(a) - order.indexOf(b);
  });
  
  return { states, statuses, riskLevels };
};

export const PRList: React.FC<PRListProps> = ({ 
  pullRequests, 
  repositoryName, 
  isLoading = false 
}) => {
  const [filters, setFilters] = React.useState({
    state: 'all',
    status: 'all',
    riskLevel: 'all',
    search: ''
  });

  const { states, statuses, riskLevels } = getFilterOptions(pullRequests);

  const filteredPRs = React.useMemo(() => {
    let filtered = pullRequests;

    if (filters.state !== 'all') {
      filtered = filtered.filter(pr => pr.state === filters.state);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(pr => pr.resolution_status === filters.status);
    }

    if (filters.riskLevel !== 'all') {
      filtered = filtered.filter(pr => pr.risk_level === filters.riskLevel);
    }

    if (filters.search) {
      filtered = filtered.filter(pr => 
        pr.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        pr.user.login.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    return sortPRsByRisk(filtered);
  }, [pullRequests, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading pull requests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Pull Requests - {repositoryName}
        </h2>
        <span className="text-sm text-gray-500">
          {filteredPRs.length} of {pullRequests.length} PRs
        </span>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search PRs..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* State Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              State
            </label>
            <select
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All States</option>
              {states.map(state => (
                <option key={state} value={state}>
                  {state.charAt(0).toUpperCase() + state.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Risk Level
            </label>
            <select
              value={filters.riskLevel}
              onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Risk Levels</option>
              {riskLevels.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Clear Filters */}
        <div className="flex justify-end">
          <button
            onClick={() => setFilters({ state: 'all', status: 'all', riskLevel: 'all', search: '' })}
            className="text-sm text-blue-700 hover:text-blue-900 font-semibold px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* PR List */}
      <div className="space-y-3">
        {filteredPRs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pull requests found matching the current filters.
          </div>
        ) : (
          filteredPRs.map((pr) => (
            <PRCard key={pr.id} pr={pr} repositoryName={repositoryName} />
          ))
        )}
      </div>
    </div>
  );
};
