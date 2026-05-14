'use client';

import Link from 'next/link';
import { useBreadcrumb } from '@/providers/BreadcrumbProvider';
import { usePathname } from 'next/navigation';
import { CommonSection } from '@/components/layouts/CommonSection';

export const Breadcrumb = () => {
  const { items } = useBreadcrumb();
  const pathname = usePathname();

  if (items.length === 0 || pathname === '/') {
    return null;
  }

  return (
    <CommonSection py="none">
      <nav className="pt-4">
        <ol className="flex items-center space-x-3 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-blue-600 hover:underline"
                >
                  {item.text}
                </Link>
              ) : (
                <span>{item.text}</span>
              )}
              {index < items.length - 1 && (
                <span className="pl-3 text-gray-400"> &gt;</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </CommonSection>
  );
};
