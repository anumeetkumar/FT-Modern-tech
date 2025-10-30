// File: "@/components/ui/toggle.tsx"
/**
 * Reusable Toggle Component
 * 
 * Consistent toggle switch design following the app's black/white theme.
 * Matches the design pattern used in vehicles page and other components.
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
  onClick
}: ToggleProps) {
  const sizeClasses = {
    sm: {
      track: "h-4 w-7",
      thumb: "h-3 w-3 left-0.5 top-0.5 peer-checked:translate-x-3"
    },
    md: {
      track: "h-5 w-9", 
      thumb: "h-4 w-4 left-0.5 top-0.5 peer-checked:translate-x-4"
    },
    lg: {
      track: "h-6 w-11",
      thumb: "h-5 w-5 left-0.5 top-0.5 peer-checked:translate-x-5"
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <label className={`relative inline-flex cursor-pointer items-center ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}>
      <input 
        type="checkbox" 
        className="peer sr-only" 
        checked={checked} 
        disabled={disabled}
        onChange={(e) => {
          if (!disabled) {
            onChange(e.target.checked);
          }
        }} 
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
        aria-label={label}
      />
      
      {/* Track */}
      <div className={`
        ${currentSize.track} rounded-full transition-all duration-200
        bg-slate-200 dark:bg-slate-600 
        peer-checked:bg-slate-900 dark:peer-checked:bg-slate-300
      `} />
      
      {/* Thumb */}
      <div className={`
        absolute ${currentSize.thumb} rounded-full shadow transition-transform duration-200
        bg-white dark:bg-slate-800 
        peer-checked:bg-white dark:peer-checked:bg-slate-900
      `} />
      
      {/* Optional Label */}
      {label && (
        <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
          {label}
        </span>
      )}
    </label>
  );
}