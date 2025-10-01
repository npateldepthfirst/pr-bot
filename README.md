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
- **Modular Architecture**: Well-organized components, utilities, and icons
- **DRY Principles**: Reusable components and centralized helper functions

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

### Generating Sample Data

The project includes a Python script to generate realistic sample data:

```bash
python seed.py
```

This will create `mock-data.json` with sample security analytics data for testing and development.

## Project Structure

```
src/
├── app/
│   ├── components/               # Reusable UI components
│   │   ├── icons.tsx            # SVG icon components
│   │   ├── MetricCard.tsx       # Summary metrics card
│   │   ├── VulnerabilityCard.tsx # Vulnerability breakdown card
│   │   ├── RepositoryCard.tsx   # Repository overview card
│   │   ├── RiskyRepositoryItem.tsx # Risky repository list item
│   │   ├── PRCard.tsx           # Individual PR card
│   │   ├── PRList.tsx           # PR list with filtering
│   │   └── PRModal.tsx          # Modal for PR details
│   ├── utils/                   # Utility functions
│   │   └── utilities.ts         # Risk calculation helpers
│   ├── stores/                  # Redux store configuration
│   │   ├── githubInfoStore.ts   # Main Redux slice with async thunks
│   │   ├── store.ts             # Store configuration
│   │   └── hooks.ts             # Typed Redux hooks
│   ├── GithubSecurityDashboard.tsx # Main dashboard component
│   ├── providers.tsx            # Redux Provider wrapper
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Home page
├── public/
│   └── mock-data.json           # Sample security analytics data
├── seed.py                      # Python script to generate mock data
└── globals.css                  # Global styles and Tailwind imports
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

## Architecture

### Redux Store
The application uses Redux Toolkit for state management with the following structure:

- **State**: `{ githubInfo: { data, loading, error, modal } }`
- **Actions**: `loadGitHubData` (async thunk), `openPRModal`, `closePRModal`
- **Selectors**: Typed selectors for data access and modal state
- **Reducers**: Handles loading, success, error, and modal states

### Component Organization
- **Card Components**: Modular, reusable cards for different data types
- **Utility Functions**: Centralized helper functions for risk calculations
- **Icon Components**: SVG icons organized in a dedicated file
- **Modal System**: Reusable modal for detailed PR views

### File Organization Benefits
- **Easy Navigation**: Clear folder structure makes finding files intuitive
- **Maintainability**: Changes to specific features are isolated to relevant files
- **Reusability**: Components and utilities can be easily imported anywhere
- **Scalability**: New features can be added without cluttering existing files
- **Team Collaboration**: Clear separation of concerns reduces merge conflicts

## Customization

### Adding New Metrics
1. Update the `GitHubData` interface in `githubInfoStore.ts`
2. Add new selectors for the data
3. Create new components in the `components/` directory
4. Update the dashboard layout

### Adding New Components
1. Create component file in `src/app/components/`
2. Follow existing patterns for props and styling
3. Import and use in the main dashboard
4. Add any new utility functions to `utils/utilities.ts`

### Styling
- Modify Tailwind classes in individual component files
- Update gradient configurations in the dashboard data arrays
- Customize colors in the `vulnerabilityCards` and `metricCards` arrays
- Add new icons to `components/icons.tsx`

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
- **DRY (Don't Repeat Yourself)**: Reusable components and centralized utilities
- **Type Safety**: Full TypeScript coverage with proper interfaces
- **Modular Architecture**: Well-organized file structure with clear separation of concerns
- **Component Composition**: Small, focused, single-responsibility components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Semantic HTML and proper ARIA labels
- **Maintainability**: Easy to modify and extend with clear file organization

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