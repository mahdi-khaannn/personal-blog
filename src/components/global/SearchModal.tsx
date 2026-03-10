import { useState, useEffect, useRef } from 'react';

// Types for Pagefind UI
declare global {
    interface Window {
        pagefind: any;
    }
}

export default function SearchModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Keyboard shortcut CMD+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Load Pagefind instance dynamically
    useEffect(() => {
        if (isOpen) {
            const loadPagefind = async () => {
                try {
                    // Pagefind is generated at build time in dist/pagefind
                    if (typeof window.pagefind === 'undefined') {
                        // Use string interpolation to completely hide this from Vite static analysis
                        const pagefindModule = '/pagefind/pagefind.js';
                        const pagefind = await import(/* @vite-ignore */ `${pagefindModule}`);
                        await pagefind.options({
                            excerptLength: 15
                        });
                        window.pagefind = pagefind;
                    }
                } catch (error) {
                    console.error('Failed to load Pagefind:', error);
                }
            };

            loadPagefind();

            // Auto focus
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        } else {
            // Reset state on close
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    // Perform search
    useEffect(() => {
        const search = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            if (window.pagefind) {
                setIsSearching(true);
                const searchRes = await window.pagefind.search(query);
                const topResults = await Promise.all(
                    searchRes.results.slice(0, 5).map((r: any) => r.data())
                );
                setResults(topResults);
                setIsSearching(false);
            }
        };

        // Debounce basic
        const timeoutId = setTimeout(() => {
            search();
        }, 200);

        return () => clearTimeout(timeoutId);
    }, [query]);

    // Prevent background scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="group flex items-center justify-between gap-2 px-3 py-1.5 w-64 md:w-80 rounded-md border border-[#30363d] bg-[#0d1117] hover:border-[#8b949e] transition-colors text-sm text-[#8b949e] focus:outline-none focus:ring-1 focus:ring-primary-500 shadow-sm"
                aria-label="Search articles"
            >
                <div className="flex items-center gap-2 truncate">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8b949e] group-hover:text-[#c9d1d9] transition-colors"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <span className="truncate group-hover:text-[#c9d1d9] transition-colors">Search or jump to...</span>
                </div>
                <span className="hidden md:inline-flex items-center text-[10px] px-1.5 py-0.5 font-medium border border-[#3d444d] rounded-sm bg-transparent group-hover:border-[#8b949e] transition-colors text-[#8b949e]">
                    <kbd className="font-sans">/</kbd>
                </span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-32 px-4 backdrop-blur-sm bg-[var(--bg-color)]/80 animate-in fade-in duration-200">
                    <div
                        className="fixed inset-0"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />

                    <div className="relative w-full max-w-xl bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-200">
                        <div className="flex items-center border-b border-[var(--border-color)] px-4">
                            <svg className="text-[var(--text-muted)] w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search articles, patterns, frameworks..."
                                className="w-full bg-transparent py-4 outline-none text-[var(--text-color)] placeholder:text-[var(--text-muted)] focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-color)] rounded-md transition-shadow"
                            />
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-[var(--text-muted)] hover:text-[var(--text-color)] text-xs border border-[var(--border-color)] rounded px-2 py-1 ml-2"
                            >
                                ESC
                            </button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-2">
                            {!query.trim() ? (
                                <div className="p-8 text-center text-sm text-[var(--text-muted)]">
                                    Begin typing to search across all deep dives and tutorials.
                                </div>
                            ) : isSearching ? (
                                <div className="p-8 text-center text-sm text-[var(--text-muted)] animate-pulse">
                                    Searching...
                                </div>
                            ) : results.length > 0 ? (
                                <ul className="space-y-1">
                                    {results.map((result, i) => (
                                        <li key={i}>
                                            <a
                                                href={result.url}
                                                onClick={() => setIsOpen(false)}
                                                className="block p-3 rounded-lg hover:bg-[var(--border-color)] transition-colors group"
                                            >
                                                <h4 className="font-bold text-[var(--text-color)] group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-1">
                                                    {result.meta.title || result.url}
                                                </h4>
                                                <p
                                                    className="text-sm text-[var(--text-muted)] line-clamp-2"
                                                    dangerouslySetInnerHTML={{ __html: result.excerpt }}
                                                />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-8 text-center text-sm text-[var(--text-muted)]">
                                    No results found for "{query}".
                                </div>
                            )}
                        </div>

                        <div className="bg-[var(--border-color)]/30 border-t border-[var(--border-color)] p-2 px-4 flex justify-between items-center text-xs text-[var(--text-muted)]">
                            <span>Search powered by <a href="https://pagefind.app/" className="font-semibold text-[var(--text-color)] hover:underline" target="_blank" rel="noreferrer">Pagefind</a></span>
                            <span className="opacity-0">placeholder</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
