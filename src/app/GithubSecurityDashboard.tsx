'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './stores/hooks';
import { 
  loadGitHubData, 
  selectGitHubData, 
  selectLoading, 
  selectError,
  selectIsModalOpen,
  selectSelectedRepository,
  openPRModal,
  closePRModal
} from './stores/githubInfoStore';
import { PRModal } from './components/PRModal';
import { MetricCard } from './components/MetricCard';
import { VulnerabilityCard } from './components/VulnerabilityCard';
import { RepositoryCard } from './components/RepositoryCard';
import { RiskyRepositoryItem } from './components/RiskyRepositoryItem';
import { RepositoryIcon, ClockIcon, WarningIcon, CheckIcon } from './components/icons';


export default function GitHubSecurityDashboard() {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectGitHubData);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const isModalOpen = useAppSelector(selectIsModalOpen);
  const selectedRepository = useAppSelector(selectSelectedRepository);

  useEffect(() => {
    dispatch(loadGitHubData());
  }, [dispatch]);

  const handleRepositoryClick = (repo: any) => {
    dispatch(openPRModal(repo));
  };

  const handleCloseModal = () => {
    dispatch(closePRModal());
  };

  const handleVulnerabilityCardClick = (severity: string) => {
    if (data && data.repositories.length > 0) {
      // Find all PRs across all repositories that have vulnerabilities of this severity
      // Include the original repository name with each PR
      const prsWithSeverity = data.repositories.flatMap(repo => 
        repo.pull_requests
          .filter(pr => 
            pr.security_analysis.some(analysis => analysis.severity === severity)
          )
          .map(pr => ({
            ...pr,
            originalRepository: repo.name,
            originalRepositoryUrl: repo.html_url
          }))
      );


      if (prsWithSeverity.length > 0) {
        // Create a virtual repository containing only PRs with the selected severity
        const virtualRepo = {
          id: -1, // Special ID for filtered view
          name: `${severity} Severity Vulnerabilities`,
          full_name: `filtered/${severity.toLowerCase()}-severity-vulnerabilities`,
          html_url: '#',
          private: false,
          pull_requests: prsWithSeverity,
          analytics: {
            total_prs: prsWithSeverity.length,
            open_prs_with_vulnerabilities: prsWithSeverity.filter(pr => pr.state === 'open').length,
            risk_score: prsWithSeverity.length > 0 ? Math.round(prsWithSeverity.reduce((sum, pr) => sum + pr.risk_score, 0) / prsWithSeverity.length) : 0,
            vulnerability_counts: {
              Critical: prsWithSeverity.filter(pr => pr.risk_level === 'Critical').length,
              High: prsWithSeverity.filter(pr => pr.risk_level === 'High').length,
              Medium: prsWithSeverity.filter(pr => pr.risk_level === 'Medium').length,
              Low: prsWithSeverity.filter(pr => pr.risk_level === 'Low').length,
            }
          }
        };
        dispatch(openPRModal(virtualRepo));
      } else {
        // Show a message that no PRs with this severity were found
      }
    }
  };

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
            <MetricCard 
              key={index} 
              {...card} 
            />
          ))}
        </div>

        {/* Vulnerability Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Vulnerability Breakdown</h2>
          {vulnerabilityCards.filter(card => card.count > 0).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {vulnerabilityCards
                .filter(card => card.count > 0)
                .map((card, index) => (
                  <VulnerabilityCard 
                    key={index} 
                    {...card} 
                    onClick={() => handleVulnerabilityCardClick(card.severity)}
                  />
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">No vulnerabilities found</p>
              <p className="text-gray-400 text-sm mt-1">All repositories are secure!</p>
            </div>
          )}
        </div>

        {/* Riskiest Repositories */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Riskiest Repositories</h2>
          <div className="space-y-3">
            {data.summary_analytics.riskiest_repositories.map((riskyRepo, index) => {
              // Find the full repository data
              const fullRepo = data.repositories.find(repo => repo.name === riskyRepo.name);
              return (
                <RiskyRepositoryItem 
                  key={riskyRepo.name} 
                  repo={fullRepo || riskyRepo} 
                  index={index} 
                  onRepositoryClick={handleRepositoryClick}
                />
              );
            })}
          </div>
        </div>

        {/* Repositories Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Repositories Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.repositories.map((repo) => (
              <RepositoryCard key={repo.id} repo={repo} onRepositoryClick={handleRepositoryClick} />
            ))}
          </div>
        </div>
      </div>

      {/* PR Modal */}
      <PRModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        repository={selectedRepository}
      />
    </div>
  );
}
