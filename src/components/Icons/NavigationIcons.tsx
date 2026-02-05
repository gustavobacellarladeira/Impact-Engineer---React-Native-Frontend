/**
 * Navigation Icons
 * SVG icons for bottom tab navigation
 */

import React from 'react';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  focused?: boolean;
}

// Home/Transactions Icon
export const TransactionsIcon = ({
  size = 24,
  color = '#64748B',
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 22V12h6v10"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Analytics/Chart Icon
export const AnalyticsIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 20V10M12 20V4M6 20v-6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Pie Chart Icon (alternative for analytics)
export const PieChartIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21.21 15.89A10 10 0 118 2.83"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M22 12A10 10 0 0012 2v10h10z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Wallet Icon
export const WalletIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x={2}
      y={6}
      width={20}
      height={14}
      rx={2}
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M22 10H18a2 2 0 000 4h4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Circle cx={18} cy={12} r={1} fill={color} />
    <Path
      d="M6 6V4a2 2 0 012-2h8a2 2 0 012 2v2"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

// List Icon for transactions
export const ListIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line
      x1={8}
      y1={6}
      x2={21}
      y2={6}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Line
      x1={8}
      y1={12}
      x2={21}
      y2={12}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Line
      x1={8}
      y1={18}
      x2={21}
      y2={18}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Circle cx={4} cy={6} r={1.5} fill={color} />
    <Circle cx={4} cy={12} r={1.5} fill={color} />
    <Circle cx={4} cy={18} r={1.5} fill={color} />
  </Svg>
);

// Arrow up icon for income trend
export const TrendUpIcon = ({ size = 24, color = '#10B981' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 6l-9.5 9.5-5-5L1 18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 6h6v6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Arrow down icon for expense trend
export const TrendDownIcon = ({ size = 24, color = '#EF4444' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 18l-9.5-9.5-5 5L1 6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 18h6v-6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Calendar icon for time filters
export const CalendarIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x={3}
      y={4}
      width={18}
      height={18}
      rx={2}
      stroke={color}
      strokeWidth={2}
    />
    <Line
      x1={16}
      y1={2}
      x2={16}
      y2={6}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Line
      x1={8}
      y1={2}
      x2={8}
      y2={6}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Line
      x1={3}
      y1={10}
      x2={21}
      y2={10}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

// Filter icon
export const FilterIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Sort icon (arrows up/down)
export const SortIcon = ({ size = 24, color = '#64748B' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 15l5 5 5-5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7 9l5-5 5 5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Chevron down icon
export const ChevronDownIcon = ({
  size = 24,
  color = '#64748B',
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9l6 6 6-6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
