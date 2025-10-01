import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types based on the mock data structure
export interface User {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

export interface SecurityAnalysis {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  vulnerability_type: string;
  file_path: string;
  line_number: number;
  comment_created_at: string;
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed';
  resolution_status: 'Needs Review' | 'Resolved' | 'Fix in Progress';
  html_url: string;
  user: User;
  created_at: string;
  additions: number;
  deletions: number;
  assignees: User[];
  risk_score: number;
  risk_level: 'None' | 'Low' | 'Medium' | 'High' | 'Critical';
  security_analysis: SecurityAnalysis[];
}

export interface RepositoryAnalytics {
  total_prs: number;
  open_prs_with_vulnerabilities: number;
  risk_score: number;
  vulnerability_counts: {
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
  };
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  private: boolean;
  pull_requests: PullRequest[];
  analytics: RepositoryAnalytics;
}

export interface RiskiestRepository {
  name: string;
  risk_score: number;
}

export interface SummaryAnalytics {
  total_repositories: number;
  total_pull_requests: number;
  open_prs_with_vulnerabilities: number;
  vulnerability_counts: {
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
  };
  riskiest_repositories: RiskiestRepository[];
}

export interface GitHubData {
  summary_analytics: SummaryAnalytics;
  repositories: Repository[];
}

// Initial state
interface GitHubInfoState {
  data: GitHubData | null;
  loading: boolean;
  error: string | null;
}

const initialState: GitHubInfoState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk to load mock data
export const loadGitHubData = createAsyncThunk(
  'githubInfo/loadData',
  async () => {
    try {
      console.log('Fetching mock data from /mock-data.json...');
      const response = await fetch('/mock-data.json');
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const data: GitHubData = await response.json();
      console.log('Data loaded successfully:', data);
      return data;
    } catch (error) {
      console.error('Error loading GitHub data:', error);
      throw new Error(`Failed to load GitHub data: ${error}`);
    }
  }
);

// GitHub info slice
const githubInfoSlice = createSlice({
  name: 'githubInfo',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateRepositoryRisk: (
      state,
      action: PayloadAction<{ repositoryId: number; riskScore: number }>
    ) => {
      if (state.data) {
        const repository = state.data.repositories.find(
          (repo) => repo.id === action.payload.repositoryId
        );
        if (repository) {
          repository.analytics.risk_score = action.payload.riskScore;
        }
      }
    },
    updatePullRequestStatus: (
      state,
      action: PayloadAction<{
        repositoryId: number;
        pullRequestId: number;
        status: PullRequest['resolution_status'];
      }>
    ) => {
      if (state.data) {
        const repository = state.data.repositories.find(
          (repo) => repo.id === action.payload.repositoryId
        );
        if (repository) {
          const pullRequest = repository.pull_requests.find(
            (pr) => pr.id === action.payload.pullRequestId
          );
          if (pullRequest) {
            pullRequest.resolution_status = action.payload.status;
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadGitHubData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadGitHubData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(loadGitHubData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load data';
      });
  },
});

export const { clearError, updateRepositoryRisk, updatePullRequestStatus } = githubInfoSlice.actions;

// Selectors
export const selectGitHubData = (state: { githubInfo: GitHubInfoState }) => state.githubInfo.data;
export const selectLoading = (state: { githubInfo: GitHubInfoState }) => state.githubInfo.loading;
export const selectError = (state: { githubInfo: GitHubInfoState }) => state.githubInfo.error;

export const selectSummaryAnalytics = (state: { githubInfo: GitHubInfoState }) => 
  state.githubInfo.data?.summary_analytics;

export const selectRepositories = (state: { githubInfo: GitHubInfoState }) => 
  state.githubInfo.data?.repositories || [];

export const selectRepositoryById = (state: { githubInfo: GitHubInfoState }, repositoryId: number) =>
  state.githubInfo.data?.repositories.find(repo => repo.id === repositoryId);

export const selectOpenPullRequests = (state: { githubInfo: GitHubInfoState }) =>
  state.githubInfo.data?.repositories.flatMap(repo => 
    repo.pull_requests.filter(pr => pr.state === 'open')
  ) || [];

export const selectCriticalVulnerabilities = (state: { githubInfo: GitHubInfoState }) =>
  state.githubInfo.data?.repositories.flatMap(repo =>
    repo.pull_requests.flatMap(pr =>
      pr.security_analysis.filter(analysis => analysis.severity === 'Critical')
    )
  ) || [];

export const selectRiskiestRepositories = (state: { githubInfo: GitHubInfoState }) =>
  state.githubInfo.data?.summary_analytics.riskiest_repositories || [];

export default githubInfoSlice.reducer;
