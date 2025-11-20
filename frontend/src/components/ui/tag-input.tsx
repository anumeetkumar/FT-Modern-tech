'use client';

import * as React from 'react';
import { Close } from '@mui/icons-material';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Input } from './input';

interface TagInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
  disabled?: boolean;
}

export const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  ({ value = [], onChange, placeholder = 'Add tags...', maxTags = 10, className, disabled, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTag();
      } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
        removeTag(value.length - 1);
      }
    };

    const addTag = () => {
      const trimmedValue = inputValue.trim();
      if (
        trimmedValue &&
        !value.includes(trimmedValue) &&
        value.length < maxTags &&
        trimmedValue.length > 0
      ) {
        onChange?.([...value, trimmedValue]);
        setInputValue('');
      }
    };

    const removeTag = (indexToRemove: number) => {
      onChange?.(value.filter((_, index) => index !== indexToRemove));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const handleInputBlur = () => {
      addTag();
    };

    return (
      <div
        className={cn(
          'flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 typo-p ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex flex-wrap gap-1 mr-2">
          {value.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1 text-xs"
            >
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <Close className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
        <Input
          {...props}
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          placeholder={value.length >= maxTags ? `Maximum ${maxTags} tags` : placeholder}
          disabled={disabled || value.length >= maxTags}
          className="flex-1 border-0 bg-transparent p-0 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    );
  }
);

TagInput.displayName = 'TagInput';
