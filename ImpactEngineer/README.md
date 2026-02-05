# Impact Engineer - Transaction History App

A React Native mobile application that displays a user's transaction history with filtering and search capabilities. Built for the Gerald Impact Engineer challenge.

![React Native](https://img.shields.io/badge/React_Native-0.83.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey)

## 📱 Features

- **Transaction List**: View all recent transactions with merchant name, amount, date, and category
- **Color-coded Amounts**: Green for income (+), red for expenses (-)
- **Filter by Type**: Toggle between All, Income, and Expenses
- **Search**: Debounced search by merchant name
- **Pull-to-Refresh**: Swipe down to refresh transaction list
- **Loading States**: Skeleton loading animation while fetching data
- **Error Handling**: Error state with retry option
- **Empty States**: Contextual empty states for no transactions or no filter matches

## 🏗️ Architecture

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── EmptyState/       # Empty state display
│   ├── ErrorState/       # Error state with retry
│   ├── FilterBar/        # Transaction type filter buttons
│   ├── SearchBar/        # Merchant search input
│   ├── TransactionItem/  # Single transaction row
│   └── TransactionSkeleton/ # Loading skeleton
├── data/                 # Mock data
│   └── mockTransactions.ts
├── hooks/                # Custom React hooks
│   ├── useDebounce.ts    # Debounce value changes
│   └── useTransactions.ts # Transaction data management
├── screens/              # Screen components
│   └── TransactionHistoryScreen/
├── services/             # API/data services
│   └── transactionService.ts
├── theme/                # Design tokens
│   └── index.ts
├── types/                # TypeScript type definitions
│   └── transaction.ts
└── utils/                # Utility functions
    ├── currency.ts       # Currency formatting
    └── date.ts           # Date formatting
```

### Key Architecture Decisions

1. **Separation of Concerns**

   - Components are purely presentational where possible
   - Business logic lives in custom hooks (`useTransactions`)
   - Data fetching is abstracted in services (`transactionService`)
   - Formatting utilities are extracted for reusability and testing

2. **Performance Optimizations**

   - `React.memo()` on list items to prevent unnecessary re-renders
   - `useCallback` for all event handlers and render functions
   - `useMemo` for computed values
   - FlatList with `getItemLayout` for fixed-height items
   - `removeClippedSubviews`, `windowSize`, and batch optimizations
   - Debounced search (300ms) to reduce API calls

3. **Mock Data Strategy**

   - 28 realistic transactions with diverse categories
   - Simulated 800ms network delay
   - 10% random error rate for testing error states
   - Sorted by date (most recent first)

4. **State Management**
   - Local state with hooks (no external state library needed for this scope)
   - Centralized transaction state in `useTransactions` hook
   - Clear separation of loading, error, and data states

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

| Decision                        | Rationale                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| **No external state library**   | For this scope, React hooks are sufficient. Would add Redux/Zustand for larger apps |
| **Emoji icons instead of SVGs** | Faster implementation; real app would use proper icon library                       |
| **Simple in-memory mock**       | Focused on UI; could use MSW for more realistic API simulation                      |
| **Skeleton over spinner**       | Better UX - gives users visual cues about content structure                         |
| **Fixed item height**           | Enables `getItemLayout` optimization; acceptable for uniform transactions           |

## 🔮 What I'd Improve With More Time

1. **Enhanced Features**

   - Category icons with proper SVG assets
   - Transaction detail screen on tap
   - Date grouping (Today, Yesterday, This Week)
   - Sort options (date, amount)
   - Category filter in addition to type filter

2. **Technical Improvements**

   - Add react-native-reanimated for smooth filter transitions
   - Implement MSW for more robust API mocking
   - Add E2E tests with Detox
   - Offline support with persistence
   - Virtualized list with FlashList for larger datasets

3. **UX Enhancements**
   - Haptic feedback on interactions
   - Dark mode support
   - Swipe actions (delete, categorize)
   - Pull-up for quick stats summary

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
