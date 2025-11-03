// File: "@/components/ui/toggle.tsx"
/**
 * Reusable Toggle Component
 *
 * Follows app's theme colors and design system.
 * Uses `bg-primary` for active state and neutral background for inactive.
 *
 * @example
 * ```tsx
 * <Toggle
 *   checked={isActive}
 *   onChange={(checked) => setIsActive(checked)}
 *   disabled={loading}
 *   label="Toggle feature"
 *   size="md"
 * />
 * ```
 */
"use client";

import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function Toggle({
  checked,
  onChange,
  disabled = false,
  label,
  size = "md",
  className = "",
  onClick,
}: ToggleProps) {
  const sizeClasses = {
    sm: {
      track: "h-4 w-7",
      thumb: "h-3 w-3 left-0.5 top-0.5 peer-checked:translate-x-3",
    },
    md: {
      track: "h-5 w-9",
      thumb: "h-4 w-4 left-0.5 top-0.5 peer-checked:translate-x-4",
    },
    lg: {
      track: "h-6 w-11",
      thumb: "h-5 w-5 left-0.5 top-0.5 peer-checked:translate-x-5",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <label
      className={`relative inline-flex items-center select-none ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${className}`}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => {
          if (!disabled) onChange(e.target.checked);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
        aria-label={label}
      />

      {/* Track */}
      <div
        className={`
          ${currentSize.track} rounded-full transition-all duration-300
          bg-muted border border-border
          peer-checked:bg-primary peer-checked:border-primary
        `}
      />

      {/* Thumb */}
      <div
        className={`
          absolute ${currentSize.thumb} rounded-full shadow-sm transition-transform duration-300
          bg-background border border-border
          peer-checked:bg-background
        `}
      />

      {/* Optional Label */}
      {label && (
        <span className="ml-2 text-sm font-medium text-foreground/80">{label}</span>
      )}
    </label>
  );
}
