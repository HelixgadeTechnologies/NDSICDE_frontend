'use client';

import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface TagInputProps {
  label?: string;
  placeholder?: string;
  tags?: string[];
  onChange?: (tags: string[]) => void;
  className?: string;
  maxTags?: number;
  options?: string[]; // New prop for dropdown options
}

const TagInput: React.FC<TagInputProps> = ({
  label = "Target States",
  placeholder = "Type and press Enter to add...",
  tags: initialTags = [],
  onChange,
  className = "",
  maxTags,
  options = []
}) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter available options (exclude already selected tags)
  const availableOptions = options.filter(option => 
    !tags.includes(option) && 
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Reset highlighted index when options change
    setHighlightedIndex(-1);
  }, [availableOptions.length, inputValue]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && availableOptions[highlightedIndex]) {
        addTag(availableOptions[highlightedIndex]);
      } else if (inputValue.trim()) {
        addTag(inputValue.trim());
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsDropdownOpen(true);
      setHighlightedIndex(prev => 
        prev < availableOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsDropdownOpen(true);
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : availableOptions.length - 1
      );
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleInputChange = (value: string): void => {
    setInputValue(value);
    if (options.length > 0) {
      setIsDropdownOpen(value.length > 0 || availableOptions.length > 0);
    }
  };

  const addTag = (tag: string): void => {
    if (!tags.includes(tag) && (!maxTags || tags.length < maxTags)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      setInputValue('');
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
      
      if (onChange) {
        onChange(newTags);
      }
    } else {
      setInputValue('');
      setIsDropdownOpen(false);
    }
  };

  const removeTag = (indexToRemove: number): void => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    
    if (onChange) {
      onChange(newTags);
    }
  };

  const handleContainerClick = (): void => {
    inputRef.current?.focus();
    if (options.length > 0 && availableOptions.length > 0) {
      setIsDropdownOpen(true);
    }
  };

  const handleOptionClick = (option: string): void => {
    addTag(option);
  };

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div 
          className="min-h-[42px] w-full border border-gray-300 rounded-md px-3 py-2 cursor-text focus-within:ring-[#D2091E] focus-within:border-[#D2091E] transition-all"
          onClick={handleContainerClick}
        >
          <div className="flex flex-wrap gap-2 items-center">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
              >
                {tag}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(index);
                  }}
                  className="hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                  type="button"
                >
                  <Icon 
                    icon="iconamoon:close-thin" 
                    height={18}
                    width={18}
                  />
                </button>
              </span>
            ))}
            
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (options.length > 0 && availableOptions.length > 0) {
                  setIsDropdownOpen(true);
                }
              }}
              placeholder={tags.length === 0 ? placeholder : ''}
              className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
              disabled={maxTags ? tags.length >= maxTags : false}
            />
          </div>
          {options.length > 0 && availableOptions.length > 0 && (
            <div className="absolute right-3 top-3">
                <Icon icon={"formkit:down"} height={20} width={20} />
            </div>
          )}
        </div>

        {/* Dropdown */}
        {isDropdownOpen && availableOptions.length > 0 && (
          <div 
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto"
          >
            {availableOptions.map((option, index) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  index === highlightedIndex ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-between mt-1">
        {/* {maxTags && (
          <div className="text-xs text-gray-500">
            {tags.length}/{maxTags} tags
          </div>
        )} */}
        {options.length > 0 && (
          <div className="text-xs text-gray-400 mt-1">
            Use ↑↓ to navigate, Enter to select
          </div>
        )}
      </div>
    </div>
  );
};

export default TagInput;