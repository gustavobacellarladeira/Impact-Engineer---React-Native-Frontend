/**
 * Category Icons
 * SVG icons for each transaction category
 */

import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Food & Drink Icon (Fork and Knife)
export const FoodIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 3v18M12 3v18M6 3v6c0 1.657 1.343 3 3 3h0c1.657 0 3-1.343 3-3V3"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Groceries Icon (Shopping Basket)
export const GroceriesIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 7h14l-1.5 9.5a2 2 0 01-2 1.5H8.5a2 2 0 01-2-1.5L5 7z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M10 11v4M14 11v4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Shopping Icon (Shopping Bag)
export const ShoppingIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 6h12l1 14H5L6 6z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 6V4a3 3 0 013-3v0a3 3 0 013 3v2"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Income Icon (Arrow Down with line)
export const IncomeIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3v14M12 17l-5-5M12 17l5-5M5 21h14"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Bills Icon (Document with lines)
export const BillsIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x={4}
      y={3}
      width={16}
      height={18}
      rx={2}
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M8 7h8M8 11h8M8 15h4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

// Entertainment Icon (Play button)
export const EntertainmentIcon = ({
  size = 24,
  color = '#64748B',
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} />
    <Path d="M10 8l6 4-6 4V8z" fill={color} />
  </Svg>
);

// Transportation Icon (Car)
export const TransportIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 11l1.5-4.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11M5 11v6a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-6M5 11h14"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={7.5} cy={14.5} r={1.5} fill={color} />
    <Circle cx={16.5} cy={14.5} r={1.5} fill={color} />
  </Svg>
);

// Health Icon (Heart with pulse)
export const HealthIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21s-8-5-8-11a5 5 0 0110 0 5 5 0 0110 0c0 6-8 11-8 11z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 12h2l1-2 2 4 1-2h2"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Electronics Icon (Laptop)
export const ElectronicsIcon = ({
  size = 24,
  color = '#64748B',
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x={3}
      y={4}
      width={18}
      height={12}
      rx={2}
      stroke={color}
      strokeWidth={2}
    />
    <Path d="M2 20h20" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// Investments Icon (Chart going up)
export const InvestmentsIcon = ({
  size = 24,
  color = '#64748B',
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 21l6-6 4 4 8-10"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 5h4v4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Travel Icon (Airplane)
export const TravelIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Subscription Icon (Refresh/Recurring)
export const SubscriptionIcon = ({
  size = 24,
  color = '#64748B',
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 4v6h-6M1 20v-6h6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Salary Icon (Briefcase with money)
export const SalaryIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x={2}
      y={7}
      width={20}
      height={14}
      rx={2}
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 11v6M9 14h6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Freelance Icon (User with laptop)
export const FreelanceIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={7} r={4} stroke={color} strokeWidth={2} />
    <Path
      d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 11l2 2 4-4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Gift Icon (Gift box)
export const GiftIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x={3}
      y={8}
      width={18}
      height={14}
      rx={2}
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M12 8v14M3 12h18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M12 8a4 4 0 00-4-4c-1.5 0-3 1.5-3 3s1.5 3 3 3M12 8a4 4 0 014-4c1.5 0 3 1.5 3 3s-1.5 3-3 3"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Default/Other Icon (Circle with question mark)
export const DefaultIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} />
    <Path
      d="M9 9a3 3 0 115.12 2.12L12 13M12 17h.01"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Delete/Trash Icon
export const DeleteIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 11v6M14 11v6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Tag/Label Icon
export const TagIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={7} cy={7} r={1.5} fill={color} />
  </Svg>
);

// All Categories Icon (Grid)
export const AllCategoriesIcon = ({
  size = 24,
  color = '#64748B',
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x={3}
      y={3}
      width={7}
      height={7}
      rx={1.5}
      stroke={color}
      strokeWidth={2}
    />
    <Rect
      x={14}
      y={3}
      width={7}
      height={7}
      rx={1.5}
      stroke={color}
      strokeWidth={2}
    />
    <Rect
      x={3}
      y={14}
      width={7}
      height={7}
      rx={1.5}
      stroke={color}
      strokeWidth={2}
    />
    <Rect
      x={14}
      y={14}
      width={7}
      height={7}
      rx={1.5}
      stroke={color}
      strokeWidth={2}
    />
  </Svg>
);

// Map category to icon
export const getCategoryIcon = (category: string) => {
  const categoryLower = category.toLowerCase();

  if (categoryLower === 'all' || categoryLower === 'all categories') {
    return AllCategoriesIcon;
  }
  if (
    categoryLower.includes('food') ||
    categoryLower.includes('drink') ||
    categoryLower.includes('dining')
  ) {
    return FoodIcon;
  }
  if (categoryLower.includes('grocer')) {
    return GroceriesIcon;
  }
  if (categoryLower.includes('shop')) {
    return ShoppingIcon;
  }
  if (categoryLower.includes('income')) {
    return IncomeIcon;
  }
  if (categoryLower.includes('bill') || categoryLower.includes('utilit')) {
    return BillsIcon;
  }
  if (categoryLower.includes('entertainment')) {
    return EntertainmentIcon;
  }
  if (categoryLower.includes('transport')) {
    return TransportIcon;
  }
  if (categoryLower.includes('health') || categoryLower.includes('fitness')) {
    return HealthIcon;
  }
  if (categoryLower.includes('electronic')) {
    return ElectronicsIcon;
  }
  if (categoryLower.includes('invest')) {
    return InvestmentsIcon;
  }
  if (categoryLower.includes('travel')) {
    return TravelIcon;
  }
  if (categoryLower.includes('subscription')) {
    return SubscriptionIcon;
  }
  if (categoryLower.includes('salary')) {
    return SalaryIcon;
  }
  if (categoryLower.includes('freelance')) {
    return FreelanceIcon;
  }
  if (categoryLower.includes('gift')) {
    return GiftIcon;
  }

  return DefaultIcon;
};
