import './globals.css';
import InAppBrowserDetector from '@/components/auth/InAppBrowserDetector';
import Header from '@/components/layout/Header';

export const metadata = {
  title: 'JipScout - 대한민국 주택담보대출 판정 엔진',
  description: '재무 상황과 희망 주택 조건으로 현실적인 대출 한도와 상품 판정',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <InAppBrowserDetector />
        <Header />
        {children}
      </body>
    </html>
  );
}
