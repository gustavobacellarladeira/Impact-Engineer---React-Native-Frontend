/**
 * Icons Tests
 * Tests for category and navigation icons
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import {
  GroceriesIcon,
  TransportIcon,
  EntertainmentIcon,
  ShoppingIcon,
  FoodIcon,
  SalaryIcon,
  HealthIcon,
  TravelIcon,
  BillsIcon,
  DefaultIcon,
  IncomeIcon,
  ElectronicsIcon,
  InvestmentsIcon,
  SubscriptionIcon,
  FreelanceIcon,
  GiftIcon,
  DeleteIcon,
  TagIcon,
  AllCategoriesIcon,
  getCategoryIcon,
} from '../src/components/Icons/CategoryIcons';
import {
  TransactionsIcon,
  AnalyticsIcon,
  SortIcon,
  ChevronDownIcon,
  PieChartIcon,
  WalletIcon,
  CalendarIcon,
  FilterIcon,
  ListIcon,
  TrendUpIcon,
  TrendDownIcon,
} from '../src/components/Icons/NavigationIcons';

describe('Category Icons', () => {
  const iconProps = { size: 24, color: '#000000' };

  it('renders GroceriesIcon', () => {
    const { root } = render(<GroceriesIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders TransportIcon', () => {
    const { root } = render(<TransportIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders EntertainmentIcon', () => {
    const { root } = render(<EntertainmentIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders ShoppingIcon', () => {
    const { root } = render(<ShoppingIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders FoodIcon', () => {
    const { root } = render(<FoodIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders SalaryIcon', () => {
    const { root } = render(<SalaryIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders HealthIcon', () => {
    const { root } = render(<HealthIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders TravelIcon', () => {
    const { root } = render(<TravelIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders BillsIcon', () => {
    const { root } = render(<BillsIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders DefaultIcon', () => {
    const { root } = render(<DefaultIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders IncomeIcon', () => {
    const { root } = render(<IncomeIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders ElectronicsIcon', () => {
    const { root } = render(<ElectronicsIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders InvestmentsIcon', () => {
    const { root } = render(<InvestmentsIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders SubscriptionIcon', () => {
    const { root } = render(<SubscriptionIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders FreelanceIcon', () => {
    const { root } = render(<FreelanceIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders GiftIcon', () => {
    const { root } = render(<GiftIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders DeleteIcon', () => {
    const { root } = render(<DeleteIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders TagIcon', () => {
    const { root } = render(<TagIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders AllCategoriesIcon', () => {
    const { root } = render(<AllCategoriesIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });
});

describe('getCategoryIcon', () => {
  it('returns correct icon for Groceries', () => {
    const Icon = getCategoryIcon('Groceries');
    expect(Icon).toBe(GroceriesIcon);
  });

  it('returns correct icon for Transport', () => {
    const Icon = getCategoryIcon('Transport');
    expect(Icon).toBe(TransportIcon);
  });

  it('returns correct icon for Entertainment', () => {
    const Icon = getCategoryIcon('Entertainment');
    expect(Icon).toBe(EntertainmentIcon);
  });

  it('returns correct icon for Shopping', () => {
    const Icon = getCategoryIcon('Shopping');
    expect(Icon).toBe(ShoppingIcon);
  });

  it('returns correct icon for Dining', () => {
    const Icon = getCategoryIcon('Dining');
    expect(Icon).toBe(FoodIcon);
  });

  it('returns correct icon for Food & Dining', () => {
    const Icon = getCategoryIcon('Food & Dining');
    expect(Icon).toBe(FoodIcon);
  });

  it('returns correct icon for Salary', () => {
    const Icon = getCategoryIcon('Salary');
    expect(Icon).toBe(SalaryIcon);
  });

  it('returns correct icon for Health', () => {
    const Icon = getCategoryIcon('Health');
    expect(Icon).toBe(HealthIcon);
  });

  it('returns correct icon for Travel', () => {
    const Icon = getCategoryIcon('Travel');
    expect(Icon).toBe(TravelIcon);
  });

  it('returns correct icon for Utilities', () => {
    const Icon = getCategoryIcon('Utilities');
    expect(Icon).toBe(BillsIcon);
  });

  it('returns correct icon for Bills & Utilities', () => {
    const Icon = getCategoryIcon('Bills & Utilities');
    expect(Icon).toBe(BillsIcon);
  });

  it('returns DefaultIcon for unknown categories', () => {
    const Icon = getCategoryIcon('Unknown Category');
    expect(Icon).toBe(DefaultIcon);
  });

  it('returns DefaultIcon for empty string', () => {
    const Icon = getCategoryIcon('');
    expect(Icon).toBe(DefaultIcon);
  });

  it('returns AllCategoriesIcon for "all"', () => {
    const Icon = getCategoryIcon('all');
    expect(Icon).toBe(AllCategoriesIcon);
  });

  it('returns AllCategoriesIcon for "all categories"', () => {
    const Icon = getCategoryIcon('all categories');
    expect(Icon).toBe(AllCategoriesIcon);
  });

  it('returns IncomeIcon for Income', () => {
    const Icon = getCategoryIcon('Income');
    expect(Icon).toBe(IncomeIcon);
  });

  it('returns ElectronicsIcon for Electronics', () => {
    const Icon = getCategoryIcon('Electronics');
    expect(Icon).toBe(ElectronicsIcon);
  });

  it('returns InvestmentsIcon for Investments', () => {
    const Icon = getCategoryIcon('Investments');
    expect(Icon).toBe(InvestmentsIcon);
  });

  it('returns SubscriptionIcon for Subscription', () => {
    const Icon = getCategoryIcon('Subscription');
    expect(Icon).toBe(SubscriptionIcon);
  });

  it('returns FreelanceIcon for Freelance', () => {
    const Icon = getCategoryIcon('Freelance');
    expect(Icon).toBe(FreelanceIcon);
  });

  it('returns GiftIcon for Gift', () => {
    const Icon = getCategoryIcon('Gift');
    expect(Icon).toBe(GiftIcon);
  });

  it('returns HealthIcon for Fitness', () => {
    const Icon = getCategoryIcon('Fitness');
    expect(Icon).toBe(HealthIcon);
  });

  it('returns FoodIcon for drinks category', () => {
    const Icon = getCategoryIcon('Drinks');
    expect(Icon).toBe(FoodIcon);
  });
});

describe('Navigation Icons', () => {
  const iconProps = { size: 24, color: '#000000' };

  it('renders TransactionsIcon', () => {
    const { root } = render(<TransactionsIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders AnalyticsIcon', () => {
    const { root } = render(<AnalyticsIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders SortIcon', () => {
    const { root } = render(<SortIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders ChevronDownIcon', () => {
    const { root } = render(<ChevronDownIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders icons with custom size', () => {
    const { root } = render(<TransactionsIcon size={48} color="#FF0000" />);
    expect(root).toBeTruthy();
  });

  it('renders icons with default props', () => {
    const { root } = render(<TransactionsIcon />);
    expect(root).toBeTruthy();
  });

  it('renders PieChartIcon', () => {
    const { root } = render(<PieChartIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders WalletIcon', () => {
    const { root } = render(<WalletIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders CalendarIcon', () => {
    const { root } = render(<CalendarIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders FilterIcon', () => {
    const { root } = render(<FilterIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders ListIcon', () => {
    const { root } = render(<ListIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders TrendUpIcon', () => {
    const { root } = render(<TrendUpIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });

  it('renders TrendDownIcon', () => {
    const { root } = render(<TrendDownIcon {...iconProps} />);
    expect(root).toBeTruthy();
  });
});
