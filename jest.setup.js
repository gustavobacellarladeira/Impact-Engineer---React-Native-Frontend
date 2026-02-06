/**
 * Jest Setup File
 */

// Mock react-native-gesture-handler (MUST be before reanimated)
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View, ScrollView } = require('react-native');
  return {
    GestureHandlerRootView: ({ children, style }) =>
      React.createElement(View, { style }, children),
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: ScrollView,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    TouchableHighlight: View,
    TouchableNativeFeedback: View,
    TouchableOpacity: View,
    TouchableWithoutFeedback: View,
    PanGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    NativeViewGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(Component => Component),
    Directions: {},
  };
});

// Mock react-native-haptic-feedback
jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
  HapticFeedbackTypes: {
    impactLight: 'impactLight',
    impactMedium: 'impactMedium',
    impactHeavy: 'impactHeavy',
    selection: 'selection',
    notificationSuccess: 'notificationSuccess',
    notificationWarning: 'notificationWarning',
    notificationError: 'notificationError',
  },
}));

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
    FadeIn: { delay: jest.fn(() => ({})) },
    FadeInDown: { delay: jest.fn(() => ({})) },
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      inOut: jest.fn(),
    },
  };
});

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    NavigationContainer: ({ children }) => children,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
  };
});

// Mock @react-navigation/bottom-tabs
jest.mock('@react-navigation/bottom-tabs', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createBottomTabNavigator: () => ({
      Navigator: ({ children }) => React.createElement(View, null, children),
      Screen: ({ children }) => children,
    }),
  };
});

// Mock react-native-screens
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));

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
    Line: props => React.createElement('Line', props),
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
