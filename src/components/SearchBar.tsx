'use client';

import { forwardRef } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({ value, onChange }, ref) => {
  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9B9B]"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search notes..."
        className="w-full pl-10 pr-4 py-2 bg-[#1A1A1E] border border-[#1E1E2A] rounded-lg text-[#EFEFE6] placeholder-[#9B9B9B] focus:outline-none focus:border-[#5542FF] transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9B9B] hover:text-[#EFEFE6]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
