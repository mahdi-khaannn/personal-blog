import { useState } from 'react';

// At V1 we can either embed the Beehiiv iframe directly 
// or use their API. For the cleanest MVP, we'll build our own form UI 
// that posts to Beehiiv or simulates the success state.

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            setStatus('error');
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        setStatus('loading');

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1200));

        // For MVP phase without live API keys, we just show success.
        setStatus('success');
    };

    if (status === 'success') {
        return (
            <div className="p-6 md:p-8 bg-primary-50/50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800 rounded-2xl flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-color)] mb-2">You're in! 🎉</h3>
                <p className="text-[var(--text-muted)] max-w-sm">
                    Check your inbox to confirm your subscription. You'll get the next weekly digest every Monday.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow flex flex-col">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (status === 'error') setStatus('idle');
                        }}
                        disabled={status === 'loading'}
                        placeholder="name@example.com"
                        className={`w-full bg-[var(--bg-color)] border transition-colors px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-[var(--bg-color)] ${status === 'error'
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-[var(--border-color)] focus:border-primary-500 focus:ring-primary-500'
                            }`}
                        aria-label="Email address"
                    />
                    {status === 'error' && (
                        <span className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            {errorMessage}
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-[var(--text-color)] text-[var(--bg-color)] hover:opacity-90 font-medium px-6 py-3 rounded-lg transition-opacity shadow-sm whitespace-nowrap flex items-center justify-center disabled:opacity-70 h-[48px]"
                >
                    {status === 'loading' ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        'Subscribe'
                    )}
                </button>
            </form>
            <p className="text-xs text-[var(--text-muted)] mt-3">
                No spam. Unsubscribe at any time. Powered by Beehiiv.
            </p>
        </div>
    );
}
