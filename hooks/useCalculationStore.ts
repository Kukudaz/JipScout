'use client';

import { useState, useEffect } from 'react';

interface CalculationSummary {
  loanAmount: number;
  dsr: number;
}

export function useCalculationStore() {
  const [summary, setSummary] = useState<CalculationSummary>({
    loanAmount: 0,
    dsr: 0,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('jipscout_summary');
    if (saved) {
      try {
        setSummary(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved summary', e);
      }
    }
  }, []);

  // Update summary and persist
  const updateSummary = (newSummary: CalculationSummary) => {
    setSummary(newSummary);
    localStorage.setItem('jipscout_summary', JSON.stringify(newSummary));
    
    // Dispatch custom event to notify other instances of the hook (e.g. across pages)
    window.dispatchEvent(new Event('jipscout_summary_update'));
  };

  // Listen for updates from other components/pages
  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem('jipscout_summary');
      if (saved) {
        setSummary(JSON.parse(saved));
      }
    };

    window.addEventListener('jipscout_summary_update', handleUpdate);
    window.addEventListener('storage', handleUpdate); // Also listen to storage events across tabs

    return () => {
      window.removeEventListener('jipscout_summary_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return { ...summary, updateSummary };
}
