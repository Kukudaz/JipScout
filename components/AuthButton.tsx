'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // 현재 세션 확인
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getUser();

    // 로그인 상태 변화 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="w-20 h-8 animate-pulse bg-gray-100 rounded-full" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/my/calculations" className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--secondary)] hover:text-black transition-colors">
          <UserIcon className="w-3 h-3" /> My Data
        </Link>
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors text-gray-500"
        >
          <LogOut className="w-3 h-3" /> Logout
        </button>
      </div>
    );
  }

  return (
    <Link 
      href="/login"
      className="bg-[var(--secondary)] text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2.5 rounded-full hover:shadow-[0_10px_20px_rgba(0,49,83,0.2)] hover:scale-105 active:scale-95 transition-all"
    >
      Login
    </Link>
  );
}
