'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface BodyLayoutProps {
  children: ReactNode;
}

export const BodyLayout = ({ children }: BodyLayoutProps) => {
  const pathname = usePathname();
  const isTopPage = pathname === '/';

  const gridAreas = isTopPage
    ? "[grid-template-areas:'header'_'main'_'footer'] grid-rows-[auto_1fr_auto]"
    : "[grid-template-areas:'header'_'breadcrumb'_'main'_'footer'] grid-rows-[auto_auto_1fr_auto]";

  return <body className={`grid min-h-screen ${gridAreas}`}>{children}</body>;
};
