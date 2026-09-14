import React from 'react';

const SvgIcon = ({
  children,
  size = 18,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    {children}
  </svg>
);

export const SearchIcon = (props) => (
  <SvgIcon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m16.2 16.2 4.3 4.3" />
  </SvgIcon>
);

export const CloseIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </SvgIcon>
);

export const ArrowUpRightIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M7 17 17 7" />
    <path d="M9 7h8v8" />
  </SvgIcon>
);

export const SparklesIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
    <path d="M5 16l.7 2.1L8 19l-2.3.8L5 22l-.8-2.2L2 19l2.2-.9L5 16Z" />
    <path d="M18 2l.6 1.7L20 4.3l-1.4.6L18 6.5l-.6-1.6L16 4.3l1.4-.6L18 2Z" />
  </SvgIcon>
);

export const ChevronDownIcon = (props) => (
  <SvgIcon {...props}>
    <path d="m6 9 6 6 6-6" />
  </SvgIcon>
);
