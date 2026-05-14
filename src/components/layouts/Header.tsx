import Link from 'next/link';
import { HeaderNavigation } from '@/components/layouts/HeaderNavigation';
import { CommonSection } from '@/components/layouts/CommonSection';

export const Header = () => {
  return (
    <header className="bg-amber-50 h-(--HEADER_HEIGHT) sticky top-0 z-100">
      <CommonSection py="none" fullHeight>
        <div className="flex justify-between items-center gap-3 h-full">
          <Link href={'/'}>LOGO</Link>
          <HeaderNavigation />
        </div>
      </CommonSection>
    </header>
  );
};
