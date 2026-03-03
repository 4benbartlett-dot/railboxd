"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, X } from "lucide-react";

export interface ComboboxOption {
  value: string;
  label: string;
  sublabel?: string;
  color?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Search...",
  label,
  className = "",
}: ComboboxProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const filtered = query.trim()
    ? options.filter((o) => {
        const q = query.toLowerCase();
        return (
          o.label.toLowerCase().includes(q) ||
          (o.sublabel?.toLowerCase().includes(q) ?? false)
        );
      })
    : options;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const el = listRef.current.children[highlightedIndex] as HTMLElement;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  // Reset highlight when filtered list changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "Enter") {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filtered[highlightedIndex]) {
            onChange(filtered[highlightedIndex].value);
            setQuery("");
            setIsOpen(false);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    },
    [isOpen, filtered, highlightedIndex, onChange]
  );

  const handleSelect = (opt: ComboboxOption) => {
    onChange(opt.value);
    setQuery("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onChange("");
    setQuery("");
    inputRef.current?.focus();
  };

  // Highlight matching text
  const highlightMatch = (text: string) => {
    if (!query.trim()) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="text-[var(--rb-accent)] font-semibold">
          {text.slice(idx, idx + query.length)}
        </span>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-[10px] font-semibold text-[var(--rb-text-muted)] uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? query : selectedOption?.label ?? ""}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setQuery("");
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-[var(--rb-bg-card)] border border-[var(--rb-border)] rounded-xl px-3 py-2.5 pr-16 text-xs text-[var(--rb-text-bright)] focus:outline-none focus:border-[var(--rb-accent)] transition-colors"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 rounded hover:bg-[var(--rb-bg-hover)] text-[var(--rb-text-muted)] hover:text-[var(--rb-text-bright)] transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-[var(--rb-text-muted)] transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && filtered.length > 0 && (
        <div
          ref={listRef}
          className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-xl border border-[var(--rb-border)] bg-[var(--rb-bg-card)] shadow-xl"
        >
          {filtered.map((opt, i) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt)}
              onMouseEnter={() => setHighlightedIndex(i)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left text-xs transition-colors ${
                i === highlightedIndex
                  ? "bg-[var(--rb-bg-hover)] text-[var(--rb-text-bright)]"
                  : "text-[var(--rb-text)]"
              } ${opt.value === value ? "text-[var(--rb-accent)]" : ""}`}
            >
              {opt.color && (
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: opt.color }}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="truncate">{highlightMatch(opt.label)}</div>
                {opt.sublabel && (
                  <div className="text-[10px] text-[var(--rb-text-muted)] truncate">
                    {highlightMatch(opt.sublabel)}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.trim() && filtered.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-[var(--rb-border)] bg-[var(--rb-bg-card)] shadow-xl px-3 py-3 text-xs text-[var(--rb-text-muted)] text-center">
          No matches found
        </div>
      )}
    </div>
  );
}
