# RozgarSetu AI — From Skill to Sustainable Income

A production-quality web application for rural and marginalized users to discover livelihood opportunities, learn new skills, and build sustainable income.

## Tech Stack

- **React.js** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS v4** - Utility-first CSS
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Zustand** - Client state management
- **React Hot Toast** - Notifications

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components (Button, Input, Card, etc.)
│   ├── Header.tsx     # App header
│   ├── Sidebar.tsx    # Desktop sidebar navigation
│   └── BottomNav.tsx  # Mobile bottom navigation
├── pages/             # Route pages
│   ├── Welcome.tsx          # Welcome screen
│   ├── Login.tsx            # Login with phone
│   ├── CreateAccount.tsx    # Account creation
│   ├── OTPVerification.tsx  # OTP verification
│   ├── OnboardingStep1-5.tsx # Multi-step onboarding
│   ├── Dashboard.tsx        # Main dashboard
│   ├── Explore.tsx          # Opportunity discovery
│   ├── Learn.tsx            # Learning hub
│   ├── LearnPath.tsx        # Individual course page
│   ├── Roadmap.tsx          # AI roadmap
│   ├── Business.tsx         # Business dashboard
│   ├── Funding.tsx          # Funding & schemes
│   ├── Products.tsx         # Product catalogue
│   ├── Market.tsx           # Buyer matching
│   └── Profile.tsx          # User profile
├── layouts/
│   └── MainLayout.tsx       # Main app layout
├── hooks/
│   ├── Providers.tsx        # App providers (Query, Toast, Auth)
│   ├── useStores.ts         # Zustand stores
│   └── useQueries.ts        # TanStack Query hooks
├── services/
│   ├── api.ts               # API client (Axios)
│   └── mockServices.ts      # Mock API services
├── types/
│   └── index.ts             # TypeScript types
├── utils/
│   ├── constants.ts         # App constants
│   └── helpers.ts           # Utility functions
├── data/
│   └── mockData.ts          # Mock data
├── routes/
│   └── index.tsx            # Route configuration
└── assets/                  # Static assets
```

## Key Features

### Authentication
- Mobile number login with OTP
- Account creation
- Language selection (Hindi/English)
- Auth state persistence

### Onboarding (5 Steps)
1. Basic Information (name, age, gender, location)
2. Skills & Experience
3. Business Interest (15 categories)
4. Financial Information
5. Goals

### Main Features
- **Dashboard**: AI recommendations, journey progress, opportunities, learning, funding
- **Explore**: Find opportunities with budget, skill, difficulty filters
- **Learn**: Video courses with quizzes, AI explanations
- **Business Dashboard**: Business plan, pricing, customers, growth
- **Funding**: Government scheme matching with eligibility checks
- **Products**: Product catalogue with add/edit/delete
- **Market**: Find buyers, RFQ posting, buyer matching
- **AI Assistant**: Voice assistant, AI chat, personalized recommendations
- **Profile**: Personal info, skills, business, learning, achievements

### Design Principles
- Mobile-first responsive design
- Clean white/light background with blue/green accents
- Large readable typography
- Low cognitive load
- Accessible (semantic HTML, keyboard nav, ARIA labels)
- Touch-friendly (44px minimum touch targets)

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Architecture

All API services are in `src/services/` with mock implementations in `src/services/mockServices.ts`. The architecture supports swapping to real backend APIs by updating `src/services/api.ts`.

### Service Files
- `authService` - Authentication APIs
- `profileService` - User profile APIs
- `opportunityService` - Opportunity discovery APIs
- `learningService` - Learning path APIs
- `schemeService` - Government scheme APIs
- `productService` - Product catalogue APIs
- `marketService` - Buyer matching APIs
- `businessService` - Business dashboard APIs
- `aiService` - AI assistant APIs

## Running the Application

```bash
cd rozgarsetu-ai
npm install
npm run dev
# Open http://localhost:5173
```

For demo purposes, use OTP code: `123456`

## Next Steps

To connect to a real backend:
1. Update `VITE_API_URL` environment variable
2. Replace mock services with real API calls
3. Add proper error handling and retry logic
4. Add authentication token refresh logic
5. Connect to Node.js + Express + MongoDB backend

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
