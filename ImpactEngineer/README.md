# Impact Engineer - Transaction History App

A React Native mobile application that displays a user's transaction history with filtering, search, analytics, and data visualization. Built for the Gerald Impact Engineer challenge.

![React Native](https://img.shields.io/badge/React_Native-0.83.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.x-purple)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey)

---

## 🎬 Demo

https://github.com/gustavobacellar/Impact-Engineer---React-Native-Frontend/raw/main/ImpactEngineer/github/video/Simulator%20Screen%20Recording%20-%20iPhone%2016%20-%202026-02-05%20at%2020.48.12.mp4

---

## 📱 Features

### Core Features

- **Transaction List**: View all recent transactions with merchant name, amount, date, and category
- **Color-coded Amounts**: Green for income (+), red for expenses (-)
- **Filter by Type**: Toggle between All, Income, and Expenses with smooth animated transitions
- **Search**: Debounced search by merchant name (300ms delay for performance)
- **Pull-to-Refresh**: Swipe down to refresh transaction list
- **Loading States**: Skeleton loading animation while fetching data
- **Error Handling**: Error state with retry option
- **Empty States**: Contextual empty states for no transactions or no filter matches

### Enhanced Features

- **SVG Category Icons**: Beautiful icons for each transaction category
- **Transaction Detail Modal**: Tap any transaction to view full details
- **Date Grouping**: Transactions grouped by Today, Yesterday, This Week, This Month, Earlier
- **Sort Options**: Sort by date (newest/oldest) or amount (highest/lowest) with animated dropdown
- **Category Filter**: Filter transactions by specific category
- **Offline Support**: Redux Persist with AsyncStorage for offline data persistence
- **Haptic Feedback**: Native haptic feedback on all interactive elements
- **Swipe Actions**: Swipe left to delete, swipe right to change category
- **Dark Mode**: Full dark mode support with system preference detection and manual toggle
- **Undo Delete**: Toast notification with 5-second undo window after deleting transactions

### Analytics Dashboard (Bottom Tab Navigation)

- **Income vs Expenses Comparison**: Visual comparison bars with budget usage indicator
- **Category Breakdown**: Toggle between expense and income categories
- **Top Expenses**: Ranked list of highest spending items
- **Quick Stats**: Total transactions, average transaction value, largest transaction
- **Time Frame Filter**: View analytics for Last 7 Days, Last 30 Days, or All Time
- **Pull-to-Refresh**: Refresh analytics data with haptic feedback

---

## 🏗️ Architecture

### Project Structure

```
src/
├── components/                    # Reusable UI components
│   ├── CategoryFilter/            # Category filter chips
│   ├── CategoryPickerModal/       # Modal for changing transaction category
│   ├── EmptyState/                # Empty state display
│   ├── ErrorState/                # Error state with retry
│   ├── FilterBar/                 # Transaction type filter buttons (animated)
│   ├── Icons/                     # SVG category icons
│   ├── SearchBar/                 # Merchant search input
│   ├── SectionHeader/             # Date section headers
│   ├── SortBar/                   # Sort dropdown with animations
│   ├── StatsPanel/                # Pull-up stats summary panel
│   ├── SwipeableTransactionItem/  # Transaction row with swipe actions
│   ├── ThemeToggle/               # Dark/light mode toggle button
│   ├── TransactionDetailModal/    # Transaction detail modal
│   ├── TransactionItem/           # Single transaction row
│   ├── TransactionSkeleton/       # Loading skeleton
│   └── UndoToast/                 # Undo action toast notification
├── data/                          # Mock data
│   └── mockTransactions.ts        # 28 realistic transactions
├── hooks/                         # Custom React hooks
│   ├── useDebounce.ts             # Debounce value changes
│   └── useTransactionsRedux.ts    # RTK Query + Redux integration
├── screens/                       # Screen components
│   ├── TransactionHistoryScreen/  # Main transaction list
│   └── AnalyticsScreen/           # Analytics dashboard
├── store/                         # Redux store
│   ├── api/                       # RTK Query APIs
│   │   └── transactionsApi.ts     # Transaction data fetching
│   ├── slices/                    # Redux slices
│   │   ├── filtersSlice.ts        # Filter state management
│   │   └── localTransactionsSlice.ts # Local mutations + undo
│   ├── selectors/                 # Memoized selectors
│   ├── hooks.ts                   # Typed useDispatch/useSelector
│   └── index.ts                   # Store configuration
├── theme/                         # Design tokens & theming
│   ├── index.ts                   # Light/dark color schemes
│   └── ThemeContext.tsx           # Theme context provider
├── types/                         # TypeScript type definitions
│   └── transaction.ts
└── utils/                         # Utility functions
    ├── currency.ts                # Currency formatting
    ├── date.ts                    # Date formatting & grouping
    └── haptics.ts                 # Haptic feedback utilities
```

### State Management Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Redux Store                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐    ┌────────────────────────────────┐ │
│  │   transactionsApi    │    │           filters              │ │
│  │    (RTK Query)       │    │        (Redux Slice)           │ │
│  ├──────────────────────┤    ├────────────────────────────────┤ │
│  │ • Automatic caching  │    │ • type: 'all'|'income'|'expense'│
│  │ • Refetch on demand  │    │ • searchQuery: string          │ │
│  │ • Loading states     │    │ • category: CategoryFilter     │ │
│  │ • Error handling     │    │ • sortBy: SortOption           │ │
│  └──────────────────────┘    └────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────┐    ┌────────────────────────────────┐ │
│  │  localTransactions   │    │       Redux Persist            │ │
│  │    (Redux Slice)     │    │      (AsyncStorage)            │ │
│  ├──────────────────────┤    ├────────────────────────────────┤ │
│  │ • Deleted items      │    │ • Persists filters state       │ │
│  │ • Category changes   │    │ • Offline support              │ │
│  │ • Undo support       │    │ • Survives app restarts        │ │
│  └──────────────────────┘    └────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Interaction → Component → Custom Hook → Redux Action → Store Update → Re-render
       ↓                           ↓
   Haptic Feedback           RTK Query (for data fetching)
```

---

## 🎯 Key Architecture Decisions

### 1. Redux Toolkit + RTK Query

**Why**: RTK Query provides automatic caching, loading states, and error handling out of the box. Combined with Redux Toolkit, it offers a production-ready state management pattern with minimal boilerplate.

**Benefit**: Data fetching, caching, and refetching are handled automatically. The transition to a real API would only require changing `queryFn` to `query` with an endpoint URL.

### 2. Separation of Concerns

- **Components**: Purely presentational where possible
- **Hooks**: Business logic and state management (`useTransactionsRedux`)
- **Utils**: Pure functions for formatting (currency, dates) - easy to test
- **Slices**: State mutations and actions

**Benefit**: High testability, reusability, and maintainability.

### 3. Performance Optimizations

- `React.memo()` on all list items to prevent unnecessary re-renders
- `useCallback` for event handlers passed to child components
- `useMemo` for computed values (filtering, sorting, aggregations)
- `SectionList` with `getItemLayout` for fixed-height optimization
- Debounced search (300ms) to reduce state updates during typing
- Memoized selectors for efficient Redux state access

**Benefit**: Smooth 60fps scrolling even with large transaction lists.

### 4. Mock Data Strategy

RTK Query's `queryFn` provides mock data with:

- 28 realistic transactions with diverse categories
- Dynamic relative dates (Today, Yesterday, etc.)
- Simulated 800ms network delay
- 10% random error rate for testing error states

**Benefit**: No backend needed for development. Easily swappable to real API.

### 5. Theme System with Context

Separate `ThemeContext` with light/dark color schemes:

- System preference detection
- Manual toggle with persistence
- Consistent design tokens across the app

**Benefit**: Easy to customize and extend for branding.

---

## ⚖️ Trade-offs Given Time Constraint

| Decision                             | Trade-off                    | Rationale                                                                                                                  |
| ------------------------------------ | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Local filtering/sorting**          | All data loaded upfront      | Enables instant filter response without API roundtrips. For larger datasets, would need pagination + server-side filtering |
| **Skeleton over spinner**            | More code for loading states | Better UX - gives users visual cues about content structure                                                                |
| **SectionList grouping**             | More complex than FlatList   | Native section headers, better accessibility, cleaner code                                                                 |
| **SVG icons vs icon font**           | Slightly larger bundle       | Crisp at any size, proper accessibility labels, no font loading issues                                                     |
| **Haptic on every interaction**      | Potential battery impact     | Enhanced tactile feedback improves perceived quality                                                                       |
| **Inline styles for dynamic colors** | Some style duplication       | Necessary for theme support; static styles in StyleSheet.create                                                            |

---

## 🔮 What I'd Improve With More Time

### Short-term Improvements

- [ ] **Pagination**: Virtual scrolling for very large transaction lists
- [ ] **Search suggestions**: Autocomplete based on previous searches
- [ ] **Filters persistence**: Save filter presets
- [ ] **Animation polish**: Spring animations for modal transitions
- [ ] **Accessibility audit**: Full VoiceOver/TalkBack testing

### Medium-term Features

- [ ] **Real API integration**: Connect to actual backend
- [ ] **Push notifications**: Alerts for large transactions
- [ ] **Export functionality**: CSV/PDF export of transactions
- [ ] **Multi-currency support**: Handle different currencies
- [ ] **Recurring transactions**: Identify and group recurring payments

### Architecture Improvements

- [ ] **E2E testing**: Detox tests for critical user flows
- [ ] **Storybook**: Component documentation and visual testing
- [ ] **Error boundaries**: Granular error handling per section
- [ ] **Analytics integration**: Track user behavior patterns
- [ ] **Code splitting**: Lazy load analytics screen

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Ruby (for CocoaPods)
- Xcode 15+ (for iOS)
- Android Studio (for Android)
- CocoaPods (`gem install cocoapods`)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ImpactEngineer

# Install JavaScript dependencies
npm install

# iOS: Install CocoaPods dependencies
cd ios && bundle install && bundle exec pod install && cd ..
```

### Running the App

```bash
# Start Metro bundler
npm start

# Run on iOS (new terminal)
npm run ios

# Run on Android (new terminal)
npm run android
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

---

## 🧪 Testing

Unit tests are provided for:

| Test Suite             | Coverage                                              |
| ---------------------- | ----------------------------------------------------- |
| **Currency utilities** | Formatting, signs, edge cases, negative values        |
| **Date utilities**     | Today/yesterday detection, date differences, grouping |
| **useDebounce hook**   | Debounce behavior, timing verification                |
| **Mock data**          | Structure validation, transaction types               |

Run tests with coverage:

```bash
npm test -- --coverage
```

---

## 🤖 AI Tools Used

This project was built with the assistance of **GitHub Copilot (Claude)** which helped:

| Area                       | How AI Helped                                                 |
| -------------------------- | ------------------------------------------------------------- |
| **Boilerplate generation** | Initial project structure, Redux setup, component scaffolding |
| **Mock data creation**     | Realistic transaction data with diverse categories            |
| **Unit tests**             | Test case generation and edge case coverage                   |
| **Documentation**          | README structure and technical writing                        |
| **Debugging**              | Identifying issues with theme consistency, animation timing   |
| **Refactoring**            | Component optimization, performance improvements              |

**My role**: Architecture decisions, code review, UX design, and ensuring all generated code met quality standards. Every AI suggestion was reviewed and modified as needed.

---

## 📦 Dependencies

### Core

- `react-native`: 0.83.1
- `typescript`: 5.8
- `@reduxjs/toolkit`: State management + RTK Query
- `redux-persist`: Offline persistence
- `@react-native-async-storage/async-storage`: Storage adapter

### UI & Animations

- `react-native-reanimated`: Smooth animations
- `react-native-gesture-handler`: Swipe gestures
- `react-native-svg`: Vector icons
- `react-native-safe-area-context`: Safe area handling
- `@react-navigation/native`: Navigation
- `@react-navigation/bottom-tabs`: Tab navigation

### Testing

- `jest`: Test runner
- `@testing-library/react-native`: Component testing

---

## 📄 License

MIT

---

Built with ❤️ for Gerald
