'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ExternalLink, MoreVertical, Compass, Share } from 'lucide-react';

export default function InAppBrowserDetector() {
  const [isInApp, setIsInApp] = useState(false);
  const [os, setOs] = useState<'ios' | 'android' | 'other'>('other');

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isKakao = ua.indexOf('kakaotalk') > -1;
    const isInstagram = ua.indexOf('instagram') > -1;
    const isFacebook = ua.indexOf('fbav') > -1;
    const isLine = ua.indexOf('line') > -1;

    if (isKakao || isInstagram || isFacebook || isLine) {
      setIsInApp(true);
      
      if (ua.match(/iphone|ipad|ipod/i)) {
        setOs('ios');
      } else if (ua.match(/android/i)) {
        setOs('android');
        // Auto-redirect for Android (Chrome Intent)
        const currentUrl = window.location.href.replace(/https?:\/\//i, '');
        window.location.href = `intent://${currentUrl}#Intent;scheme=https;package=com.android.chrome;end`;
      }
    }
  }, []);

  if (!isInApp) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-[#000d1a]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
      >
        <div className="max-w-md w-full space-y-8">
          {/* Visual Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--primary)] blur-2xl opacity-20 rounded-full" />
              <div className="relative bg-white/5 border border-white/10 p-6 rounded-[2.5rem]">
                <Compass className="w-16 h-16 text-[var(--primary)] animate-pulse" />
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <div className="space-y-4">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-black text-white tracking-tight"
            >
              더 안전한 브라우저에서<br />
              이용해 주세요
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/60 text-lg font-medium leading-relaxed break-keep"
            >
              현재 사용 중인 인앱 브라우저에서는<br />
              <span className="text-white">구글 로그인 및 일부 기능이 제한</span>됩니다.
            </motion.p>
          </div>

          {/* OS Specific Guide */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-6"
          >
            {os === 'ios' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-left">
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <MoreVertical className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold">오른쪽 하단 [···] 버튼 클릭</p>
                    <p className="text-white/40 text-sm">또는 우측 하단 화살표 모양</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-left">
                  <div className="bg-[var(--primary)]/20 p-3 rounded-2xl">
                    <Compass className="w-6 h-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-white font-bold">"외부 브라우저(Safari)로 열기"</p>
                    <p className="text-white/40 text-sm">선택 시 즉시 로그인이 가능합니다.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-left">
                  <div className="bg-[var(--primary)]/20 p-3 rounded-2xl">
                    <Globe className="w-6 h-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Chrome 브라우저로 전환</p>
                    <p className="text-white/40 text-sm">잠시만 기다려 주세요...</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const currentUrl = window.location.href.replace(/https?:\/\//i, '');
                    window.location.href = `intent://${currentUrl}#Intent;scheme=https;package=com.android.chrome;end`;
                  }}
                  className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  전환이 안 된다면 여기를 클릭
                </button>
              </div>
            )}
          </motion.div>

          {/* Footer Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-2 opacity-30"
          >
            <span className="text-white text-sm font-black tracking-[0.2em] uppercase">JipScout Security</span>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
