'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { ArrowLeft, Database, Trash2, ExternalLink } from 'lucide-react';
import { Reveal } from '@/components/ui/Layout';

export default function MyCalculationsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [calculations, setCalculations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        window.location.href = '/login';
        return;
      }
      
      setUser(session.user);

      const { data } = await supabase
        .from('loan_calculations')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setCalculations(data);
      }
      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    await supabase.from('loan_calculations').delete().eq('id', id);
    setCalculations(prev => prev.filter(c => c.id !== id));
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Go Back to Dashboard
        </Link>
        
        <Reveal>
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-black text-[var(--secondary)] tracking-tight">My Data</h1>
              <p className="text-gray-500 mt-2 font-medium">{user?.user_metadata?.full_name}님의 저장된 대출 한도 계산 기록입니다.</p>
            </div>
            <div className="text-sm font-bold text-gray-400">Total {calculations.length} files</div>
          </div>

          {calculations.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-20 text-center shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100">
              <Database className="w-12 h-12 text-gray-200 mx-auto mb-6" />
              <h3 className="text-xl font-black text-gray-800 mb-2">저장된 데이터가 없습니다</h3>
              <p className="text-gray-500 mb-8">대시보드에서 계산 후 결과를 저장해보세요.</p>
              <Link 
                href="/"
                className="bg-black text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-colors"
              >
                Go to Calculator
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {calculations.map((calc, idx) => {
                const date = new Date(calc.created_at).toLocaleDateString();
                const total = (calc.total_buying_power / 10000).toFixed(1);
                
                return (
                  <div key={calc.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Snapshot #{calculations.length - idx} • {date}</div>
                      <div className="text-xl font-black text-[var(--secondary)] tracking-tight">
                        최대 가능 구매력 <span className="text-[var(--accent)]">{total}억</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* TODO: 복원 기능 추가 구상 시 구현 */}
                      <button className="text-gray-400 hover:text-black p-2 rounded-full hover:bg-gray-50 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(calc.id)}
                        className="text-red-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Reveal>
      </div>
    </div>
  );
}
