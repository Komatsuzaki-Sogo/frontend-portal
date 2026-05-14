'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const ButtonBack = () => {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const hasHistory =
      typeof window !== 'undefined' &&
      document.referrer.includes(window.location.host);

    if (hasHistory) {
      router.back();
      return;
    }

    router.push('/');
  };

  return (
    <Link
      href="/"
      className="text-blue-500 hover:underline mt-10 inline-block"
      onClick={handleBack}
    >
      ← 一覧に戻る
    </Link>
  );
};
