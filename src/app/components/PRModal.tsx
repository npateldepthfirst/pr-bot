import React from 'react';
import { Repository } from '../stores/githubInfoStore';
import { PRList } from './PRList';

interface PRModalProps {
  isOpen: boolean;
  onClose: () => void;
  repository: Repository | null;
}

export const PRModal: React.FC<PRModalProps> = ({ isOpen, onClose, repository }) => {
  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !repository) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {repository.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {repository.full_name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Repository Stats */}
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <span className="font-medium">{repository.analytics.total_prs}</span>
                  <span>Total PRs</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-orange-600">
                    {repository.analytics.open_prs_with_vulnerabilities}
                  </span>
                  <span>Vulnerable</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`font-bold px-2 py-1 rounded text-xs ${
                    repository.analytics.risk_score >= 80 
                      ? 'bg-red-100 text-red-800' 
                      : repository.analytics.risk_score >= 60 
                      ? 'bg-orange-100 text-orange-800'
                      : repository.analytics.risk_score >= 40
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    Risk: {repository.analytics.risk_score}
                  </span>
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <PRList 
              pullRequests={repository.pull_requests} 
              repositoryName={repository.name}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-500">
              Showing {repository.pull_requests.length} pull requests
            </div>
            <div className="flex space-x-3">
              <a
                href={repository.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                View on GitHub
              </a>
              <button
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
