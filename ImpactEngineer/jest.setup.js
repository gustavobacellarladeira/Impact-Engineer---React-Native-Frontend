/**
 * Jest Setup File
 */

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const { View, Text } = require('react-native');

  const Animated = {
    View,
    Text,
    createAnimatedComponent: Component => Component,
    call: jest.fn(),
  };

  return {
    __esModule: true,
    default: Animated,
    useSharedValue: jest.fn(value => ({ value })),
    useAnimatedStyle: jest.fn(() => ({})),
    withSpring: jest.fn(value => value),
    withTiming: jest.fn(value => value),
    interpolateColor: jest.fn(() => '#000000'),
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      inOut: jest.fn(),
    },
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children, style }) =>
      React.createElement(View, { style }, children),
    useSafeAreaInsets: () => inset,
  };
});

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  const MockSvg = props => React.createElement('Svg', props, props.children);
  return {
    __esModule: true,
    default: MockSvg,
    Svg: MockSvg,
    Path: props => React.createElement('Path', props),
    Circle: props => React.createElement('Circle', props),
    Rect: props => React.createElement('Rect', props),
    G: props => React.createElement('G', props, props.children),
  };
});

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Mock react-redux
jest.mock('react-redux', () => {
  const actual = jest.requireActual('react-redux');
  return {
    ...actual,
    useDispatch: () => jest.fn(),
    useSelector: jest.fn(selector => {
      // Return default state for filters
      const mockState = {
        filters: {
          filters: {
            type: 'all',
            searchQuery: '',
            category: 'all',
            sortBy: 'date_desc',
          },
        },
        transactionsApi: {},
      };
      return selector(mockState);
    }),
  };
});

// Mock redux-persist
jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist');
  return {
    ...real,
    persistReducer: (config, reducer) => reducer,
    persistStore: () => ({
      subscribe: jest.fn(),
      dispatch: jest.fn(),
      getState: jest.fn(),
    }),
  };
});

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: ({ children }) => children,
}));

// Mock the store
jest.mock('./src/store', () => ({
  store: {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
    replaceReducer: jest.fn(),
  },
  persistor: {
    subscribe: jest.fn(),
    dispatch: jest.fn(),
    getState: jest.fn(),
  },
}));

// Mock RTK Query hooks
jest.mock('./src/store/api', () => ({
  transactionsApi: {
    reducerPath: 'transactionsApi',
    reducer: (state = {}) => state,
    middleware: () => next => action => next(action),
  },
  useGetTransactionsQuery: () => ({
    data: [],
    isLoading: false,
    isFetching: false,
    error: null,
    refetch: jest.fn(),
  }),
  useGetTransactionByIdQuery: () => ({
    data: null,
    isLoading: false,
    error: null,
  }),
}));

// Mock the useTransactions/useTransactionsRedux hook
jest.mock('./src/hooks', () => {
  const originalModule = jest.requireActual('./src/hooks');
  const mockHook = () => ({
    transactions: [],
    sections: [],
    categories: [],
    filters: {
      type: 'all',
      searchQuery: '',
      category: 'all',
      sortBy: 'date_desc',
    },
    isLoading: false,
    isRefreshing: false,
    error: null,
    isFiltered: false,
    setTypeFilter: jest.fn(),
    setSearchQuery: jest.fn(),
    setCategoryFilter: jest.fn(),
    setSortBy: jest.fn(),
    refresh: jest.fn(),
    retry: jest.fn(),
  });

  return {
    ...originalModule,
    useTransactions: mockHook,
    useTransactionsRedux: mockHook,
    useDebounce: originalModule.useDebounce,
  };
});
