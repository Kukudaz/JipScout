export const metadata = {
  title: '내 집 가능 예산 계산기',
  description: '재무 상황과 희망 주택 조건으로 현실적인 예산 계산',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
