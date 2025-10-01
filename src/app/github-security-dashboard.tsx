'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './stores/hooks';
import { loadGitHubData, selectGitHubData, selectLoading, selectError } from './stores/githubInfoStore';

// Reusable components
const MetricCard = ({ title, value, icon, gradient, iconBg }: {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
}) => (
  <div className={`bg-gradient-to-r ${gradient} p-6 rounded-xl shadow-lg text-white`}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-medium opacity-90">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div className={`${iconBg} bg-opacity-30 p-3 rounded-lg`}>
        {icon}
      </div>
    </div>
  </div>
);

const VulnerabilityCard = ({ severity, count, gradient, iconBg, icon }: {
  severity: string;
  count: number;
  gradient: string;
  iconBg: string;
  icon: React.ReactNode;
}) => (
  <div className={`bg-gradient-to-br ${gradient} p-4 rounded-lg text-white`}>
    <div className="flex items-center justify-between">
      <div>
        <span className="text-sm font-medium opacity-90">{severity}</span>
        <p className="text-2xl font-bold mt-1">{count}</p>
      </div>
      <div className={`${iconBg} bg-opacity-30 p-2 rounded`}>
        {icon}
      </div>
    </div>
  </div>
);

const RepositoryCard = ({ repo }: { repo: any }) => (
  <div className="border border-gray-200 p-6 rounded-lg hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50">
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
        <span className={`font-bold px-2 py-1 rounded text-xs ${
          repo.analytics.risk_score >= 80 
            ? 'bg-red-100 text-red-800' 
            : repo.analytics.risk_score >= 60 
            ? 'bg-orange-100 text-orange-800'
            : repo.analytics.risk_score >= 40
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-green-100 text-green-800'
        }`}>
          {repo.analytics.risk_score}
        </span>
      </div>
    </div>
  </div>
);

const RiskyRepositoryItem = ({ repo, index }: { repo: any; index: number }) => (
  <div className="flex justify-between items-center bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 p-4 rounded-lg hover:shadow-md transition-shadow">
    <div className="flex items-center space-x-3">
      <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
        {index + 1}
      </div>
      <span className="font-semibold text-gray-900">{repo.name}</span>
    </div>
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Risk Score:</span>
      <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
        {repo.risk_score}
      </span>
    </div>
  </div>
);

// Icons
const RepositoryIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export default function GitHubSecurityDashboard() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectGitHubData);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  useEffect(() => {
    console.log('Dispatching loadGitHubData action...');
    dispatch(loadGitHubData());
  }, [dispatch]);

  console.log('Dashboard state:', { loading, error, data: !!data });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading GitHub security data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            No data available
          </div>
        </div>
      </div>
    );
  }

  // Data configuration for reusable components
  const metricCards = [
    {
      title: "Total Repositories",
      value: data.summary_analytics.total_repositories,
      icon: <RepositoryIcon />,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-400"
    },
    {
      title: "Total Pull Requests",
      value: data.summary_analytics.total_pull_requests,
      icon: <ClockIcon />,
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-400"
    },
    {
      title: "Vulnerable PRs",
      value: data.summary_analytics.open_prs_with_vulnerabilities,
      icon: <WarningIcon />,
      gradient: "from-orange-500 to-red-500",
      iconBg: "bg-orange-400"
    }
  ];

  const vulnerabilityCards = [
    {
      severity: "Critical",
      count: data.summary_analytics.vulnerability_counts.Critical,
      gradient: "from-red-500 to-red-600",
      iconBg: "bg-red-400",
      icon: <WarningIcon />
    },
    {
      severity: "High",
      count: data.summary_analytics.vulnerability_counts.High,
      gradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-400",
      icon: <WarningIcon />
    },
    {
      severity: "Medium",
      count: data.summary_analytics.vulnerability_counts.Medium,
      gradient: "from-yellow-500 to-yellow-600",
      iconBg: "bg-yellow-400",
      icon: <WarningIcon />
    },
    {
      severity: "Low",
      count: data.summary_analytics.vulnerability_counts.Low,
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-green-400",
      icon: <CheckIcon />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">GitHub Security Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600">Monitor security vulnerabilities across your repositories</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metricCards.map((card, index) => (
            <MetricCard key={index} {...card} />
          ))}
        </div>

        {/* Vulnerability Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vulnerability Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vulnerabilityCards.map((card, index) => (
              <VulnerabilityCard key={index} {...card} />
            ))}
          </div>
        </div>

        {/* Riskiest Repositories */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Riskiest Repositories</h2>
          <div className="space-y-3">
            {data.summary_analytics.riskiest_repositories.map((repo, index) => (
              <RiskyRepositoryItem key={repo.name} repo={repo} index={index} />
            ))}
          </div>
        </div>

        {/* Repositories Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Repositories Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.repositories.map((repo) => (
              <RepositoryCard key={repo.id} repo={repo} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
