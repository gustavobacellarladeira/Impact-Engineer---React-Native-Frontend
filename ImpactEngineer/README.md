# Impact Engineer - Transaction History App

A React Native mobile application that displays a user's transaction history with filtering and search capabilities. Built for the Gerald Impact Engineer challenge.

![React Native](https://img.shields.io/badge/React_Native-0.83.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.x-purple)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey)

## 📱 Features

### Core Features

- **Transaction List**: View all recent transactions with merchant name, amount, date, and category
- **Color-coded Amounts**: Green for income (+), red for expenses (-)
- **Filter by Type**: Toggle between All, Income, and Expenses with smooth animated transitions (react-native-reanimated)
- **Search**: Debounced search by merchant name
- **Pull-to-Refresh**: Swipe down to refresh transaction list
- **Loading States**: Skeleton loading animation while fetching data
- **Error Handling**: Error state with retry option
- **Empty States**: Contextual empty states for no transactions or no filter matches

### Enhanced Features

- **SVG Category Icons**: Beautiful icons for each transaction category (Groceries, Transport, Entertainment, etc.)
- **Transaction Detail Modal**: Tap any transaction to view full details in a slide-up modal
- **Date Grouping**: Transactions grouped by Today, Yesterday, This Week, This Month, Earlier
- **Sort Options**: Sort by date (newest/oldest) or amount (highest/lowest)
- **Category Filter**: Filter transactions by category in addition to type filter
- **Offline Support**: Redux Persist with AsyncStorage for offline data persistence
- **Haptic Feedback**: Native haptic feedback on all interactive elements (filters, buttons, list items, pull-to-refresh)
- **Swipe Actions**: Swipe left to delete transactions, swipe right to change category with an intuitive category picker
- **Dark Mode**: Full dark mode support with system preference detection and manual toggle (sun/moon icon in header)
- **Stats Summary Panel**: Pull-up panel showing transaction statistics including net balance, income/expense totals, and top categories
- **Undo Delete**: Undo toast notification appears after deleting a transaction, allowing you to restore it within 5 seconds

## 🏗️ Architecture

### Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── CategoryFilter/      # Category filter chips
│   ├── CategoryPickerModal/ # Modal for changing transaction category
│   ├── EmptyState/          # Empty state display
│   ├── ErrorState/          # Error state with retry
│   ├── FilterBar/           # Transaction type filter buttons (animated)
│   ├── Icons/               # SVG category icons
│   ├── SearchBar/           # Merchant search input
│   ├── SectionHeader/       # Date section headers
│   ├── SortBar/             # Sort dropdown
│   ├── StatsPanel/          # Pull-up stats summary panel
│   ├── SwipeableTransactionItem/ # Transaction row with swipe actions
│   ├── ThemeToggle/         # Dark/light mode toggle button
│   ├── TransactionDetailModal/ # Transaction detail modal
│   ├── TransactionItem/     # Single transaction row (non-swipeable)
│   ├── TransactionSkeleton/ # Loading skeleton
│   └── UndoToast/           # Undo action toast notification
├── data/                    # Mock data
│   └── mockTransactions.ts
├── hooks/                   # Custom React hooks
│   ├── useDebounce.ts       # Debounce value changes
│   └── useTransactionsRedux.ts # RTK Query + Redux transaction management
├── screens/                 # Screen components
│   └── TransactionHistoryScreen/
├── store/                   # Redux store
│   ├── api/                 # RTK Query APIs
│   │   └── transactionsApi.ts # Transaction data fetching
│   ├── slices/              # Redux slices
│   │   └── transactionsSlice.ts # Filter state management
│   ├── selectors/           # Memoized selectors
│   ├── hooks.ts             # Typed useDispatch/useSelector
│   └── index.ts             # Store configuration
├── theme/                   # Design tokens & theming
│   ├── index.ts             # Light/dark color schemes
│   └── ThemeContext.tsx     # Theme context provider
├── types/                   # TypeScript type definitions
│   └── transaction.ts
└── utils/                   # Utility functions
    ├── currency.ts          # Currency formatting
    ├── date.ts              # Date formatting
    └── haptics.ts           # Haptic feedback utilities
```

### State Management Architecture

The app uses **Redux Toolkit with RTK Query** for robust state management:

```
┌─────────────────────────────────────────────────────────────┐
│                        Redux Store                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │   transactionsApi   │    │        filters              │ │
│  │   (RTK Query)       │    │   (Redux Slice)             │ │
│  ├─────────────────────┤    ├─────────────────────────────┤ │
│  │ • Automatic caching │    │ • type: 'all' | 'income'... │ │
│  │ • Refetch on demand │    │ • searchQuery: string       │ │
│  │ • Loading states    │    │ • category: CategoryFilter  │ │
│  │ • Error handling    │    │ • sortBy: SortOption        │ │
│  └─────────────────────┘    └─────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Redux Persist (AsyncStorage)               │ │
│  │              • Persists filters state                   │ │
│  │              • Offline support                          │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Key Architecture Decisions

1. **Redux Toolkit + RTK Query**

   - RTK Query handles data fetching with automatic caching and refetching
   - Redux slices manage filter state separately from data
   - Redux Persist with AsyncStorage for offline support
   - Memoized selectors for efficient state access

2. **Separation of Concerns**

   - Components are purely presentational where possible
   - Business logic lives in custom hooks (`useTransactionsRedux`)
   - Data fetching is handled by RTK Query
   - Formatting utilities are extracted for reusability and testing

3. **Performance Optimizations**

   - `React.memo()` on list items to prevent unnecessary re-renders
   - `useCallback` for all event handlers and render functions
   - `useMemo` for computed values (filtering/sorting)
   - SectionList with `getItemLayout` for fixed-height items
   - RTK Query's automatic caching reduces redundant fetches
   - Debounced search (300ms) to reduce state updates

4. **Mock Data Strategy**

   - RTK Query's `queryFn` provides mock data (no actual HTTP calls)
   - 28 realistic transactions with diverse categories
   - Simulated 800ms network delay
   - 10% random error rate for testing error states
   - Easily swappable to real API by changing `queryFn` to `query`

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Ruby (for CocoaPods)
- Xcode 15+ (for iOS)
- Android Studio (for Android)

### Installation

```bash
# Clone the repository
cd ImpactEngineer

# Install dependencies
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
npm test
```

## 🧪 Testing

Unit tests are provided for:

- **Currency utilities**: Formatting, signs, edge cases
- **Date utilities**: Today/yesterday detection, date differences
- **useDebounce hook**: Debounce behavior verification
- **Mock data**: Structure validation, sorting verification

## ⚖️ Trade-offs & Decisions

| Decision                                 | Rationale                                                                   |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| **Redux Toolkit + RTK Query**            | Automatic caching, refetching, and loading states. Production-ready pattern |
| **Redux Persist with AsyncStorage**      | Offline support with minimal config. Filters persist across app restarts    |
| **SectionList for grouping**             | Native grouping with section headers, better than manual FlatList grouping  |
| **SVG Icons with react-native-svg**      | Crisp icons at any size, proper accessibility support                       |
| **RTK Query queryFn for mocking**        | No HTTP overhead; easily swap to real API by changing to query()            |
| **Skeleton over spinner**                | Better UX - gives users visual cues about content structure                 |
| **Local filtering/sorting (in useMemo)** | All data loaded upfront; enables instant filter response without API calls  |

## 🤖 AI Tools Used

This project was built with the assistance of **GitHub Copilot (Claude)** which helped:

- Generate boilerplate code structure
- Create comprehensive mock transaction data
- Write unit tests
- Draft documentation

AI tools significantly accelerated development while I focused on architecture decisions and code review.

## 📄 License

MIT

---

Built with ❤️ for Gerald

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
