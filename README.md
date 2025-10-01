# GitHub Security Analytics Dashboard

A modern, responsive dashboard built with Next.js and Redux Toolkit for monitoring security vulnerabilities across GitHub repositories. This application provides comprehensive analytics and insights into pull request security risks, vulnerability breakdowns, and repository risk assessments.

## Features

### 🔍 **Security Analytics Overview**
- **Repository Metrics**: Total repositories, pull requests, and vulnerable PRs at a glance
- **Vulnerability Breakdown**: Critical, High, Medium, and Low severity vulnerability counts
- **Risk Assessment**: Real-time risk scoring for each repository
- **Riskiest Repositories**: Ranked list of repositories with highest security risks

### 📊 **Interactive Dashboard**
- **Modern UI**: Clean, professional interface with gradient cards and responsive design
- **Real-time Data**: Live updates from Redux store with loading and error states
- **Repository Cards**: Detailed view of each repository with private/public indicators
- **Risk Visualization**: Color-coded risk scores and vulnerability severity levels

### 🛠 **Technical Features**
- **Redux State Management**: Centralized state with Redux Toolkit and async thunks
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Architecture**: Reusable, DRY components for maintainability

## Tech Stack

- **Framework**: Next.js 15.5.4 with App Router
- **State Management**: Redux Toolkit with React-Redux
- **Styling**: Tailwind CSS with custom gradients and animations
- **Language**: TypeScript for type safety
- **Icons**: Custom SVG icons for better performance
- **Data Source**: Mock JSON data (easily replaceable with real API)

## Getting Started

### Prerequisites

- Node.js 18.0 or later (recommended: Node.js 24.9.0+)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pr-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Project Structure

```
src/
├── app/
│   ├── stores/                    # Redux store configuration
│   │   ├── githubInfoStore.ts    # Main Redux slice with async thunks
│   │   ├── store.ts              # Store configuration
│   │   └── hooks.ts              # Typed Redux hooks
│   ├── github-security-dashboard.tsx  # Main dashboard component
│   ├── providers.tsx             # Redux Provider wrapper
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Home page
├── public/
│   └── mock-data.json            # Sample security analytics data
└── globals.css                   # Global styles and Tailwind imports
```

## Data Structure

The application expects data in the following format:

```typescript
interface GitHubData {
  summary_analytics: {
    total_repositories: number;
    total_pull_requests: number;
    open_prs_with_vulnerabilities: number;
    vulnerability_counts: {
      Critical: number;
      High: number;
      Medium: number;
      Low: number;
    };
    riskiest_repositories: Array<{
      name: string;
      risk_score: number;
    }>;
  };
  repositories: Array<{
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    private: boolean;
    pull_requests: Array<{
      id: number;
      number: number;
      title: string;
      state: 'open' | 'closed';
      resolution_status: 'Needs Review' | 'Resolved' | 'Fix in Progress';
      risk_score: number;
      risk_level: 'None' | 'Low' | 'Medium' | 'High' | 'Critical';
      security_analysis: Array<{
        id: string;
        severity: 'Critical' | 'High' | 'Medium' | 'Low';
        vulnerability_type: string;
        file_path: string;
        line_number: number;
        comment_created_at: string;
      }>;
    }>;
    analytics: {
      total_prs: number;
      open_prs_with_vulnerabilities: number;
      risk_score: number;
      vulnerability_counts: {
        Critical: number;
        High: number;
        Medium: number;
        Low: number;
      };
    };
  }>;
}
```

## Redux Store

The application uses Redux Toolkit for state management with the following structure:

- **State**: `{ githubInfo: { data, loading, error } }`
- **Actions**: `loadGitHubData` (async thunk)
- **Selectors**: Typed selectors for data access
- **Reducers**: Handles loading, success, and error states

## Customization

### Adding New Metrics
1. Update the `GitHubData` interface in `githubInfoStore.ts`
2. Add new selectors for the data
3. Create new components or extend existing ones
4. Update the dashboard layout

### Styling
- Modify Tailwind classes in components
- Update gradient configurations in the data arrays
- Customize colors in the `vulnerabilityCards` and `metricCards` arrays

### Data Source
Replace the mock data by:
1. Updating the `loadGitHubData` async thunk
2. Changing the fetch URL to your API endpoint
3. Ensuring the response matches the expected data structure

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

The project follows these principles:
- **DRY (Don't Repeat Yourself)**: Reusable components and utilities
- **Type Safety**: Full TypeScript coverage
- **Component Composition**: Small, focused components
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Semantic HTML and proper ARIA labels

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue in the repository or contact Nisarga P.