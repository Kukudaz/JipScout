'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ExternalLink, Compass } from 'lucide-react';

export default function InAppBrowserDetector() {
  const [showAndroidOverlay, setShowAndroidOverlay] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isKakao = ua.indexOf('kakaotalk') > -1;
    const isAndroid = ua.indexOf('android') > -1;

    // 카카오톡 && 안드로이드인 경우에만 집중 대응
    if (isKakao && isAndroid) {
      setShowAndroidOverlay(true);
      
      // 안드로이드 크롬 강제 실행 스킴
      const currentUrl = window.location.href.split('//')[1]; // https:// 제거
      const intentUrl = `intent://${currentUrl}#Intent;scheme=https;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.android.chrome;end`;
      
      // 즉시 전환 시도
      window.location.href = intentUrl;
    }
    
    // 아이폰(iOS)은 사용자가 이미 잘 된다고 확인했으므로 별도 안내 없이 통과 시킵니다.
  }, []);

  if (!showAndroidOverlay) return null;

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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
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
              transition={{ delay: 0.1 }}
              className="text-3xl font-black text-white tracking-tight"
            >
              Chrome 브라우저로<br />
              전환합니다
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-lg font-medium leading-relaxed break-keep"
            >
              카카오톡 인앱 브라우저에서는<br />
              <span className="text-white">구글 로그인이 제한</span>될 수 있어<br />
              전용 브라우저로 안전하게 연결합니다.
            </motion.p>
          </div>

          {/* Android Guide */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-left">
                <div className="bg-[var(--primary)]/20 p-3 rounded-2xl">
                  <Globe className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-white font-bold">크롬 브라우저 실행 중...</p>
                  <p className="text-white/40 text-sm">잠시 후 자동으로 페이지가 열립니다.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const currentUrl = window.location.href.split('//')[1];
                  window.location.href = `intent://${currentUrl}#Intent;scheme=https;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.android.chrome;end`;
                }}
                className="w-full py-4 bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] rounded-xl font-black transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-[var(--primary)]/20"
              >
                <ExternalLink className="w-5 h-5" />
                지금 전환하기
              </button>
            </div>
          </motion.div>

          {/* Footer Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 opacity-30"
          >
            <span className="text-white text-xs font-black tracking-[0.2em] uppercase">Security Gateway</span>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
