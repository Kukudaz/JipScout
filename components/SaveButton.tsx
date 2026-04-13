'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';
import { FinalLoanSummary, UserProfileInput, PropertyInput } from '@/types';

interface Props {
  profile: UserProfileInput;
  property: PropertyInput;
  result: FinalLoanSummary;
}

export default function SaveButton({ profile, property, result }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const supabase = createClient();

  const handleSave = async () => {
    setStatus('loading');
    
    // 세션 확인
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      window.location.href = '/login?next=/';
      return;
    }

    try {
      const { error } = await supabase.from('loan_calculations').insert({
        user_id: session.user.id,
        input_snapshot: { profile, property },
        result_snapshot: result,
        monthly_payment: result.bankMortgage.amount > 0 ? result.bankMortgage.amount : 0, // Simplified for now
        dsr: 0, // Requires DSR logic to be part of result, putting 0 as placeholder or recalculate server-side
        ltv: 0,
        total_buying_power: result.totalBuyingPower,
        newborn_status: result.newbornSpecial.status,
        didimdol_status: result.didimdol.status,
        bogeum_status: result.bogeumjari.status,
        bank_status: result.bankMortgage.status,
        policy_version: '2026-v1'
      });

      if (error) throw error;
      
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={status === 'loading' || status === 'success'}
      className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
        status === 'success' ? 'bg-emerald-500 text-white' :
        status === 'error' ? 'bg-red-500 text-white' :
        'bg-black text-white hover:bg-gray-800'
      }`}
    >
      {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
      {status === 'success' && <CheckCircle2 className="w-4 h-4" />}
      {status === 'idle' && <Save className="w-4 h-4" />}
      {status === 'loading' ? 'Saving...' : 
       status === 'success' ? 'Saved' : 
       status === 'error' ? 'Failed' : 'Save Result'}
    </button>
  );
}
