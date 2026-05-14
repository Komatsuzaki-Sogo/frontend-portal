import Link from 'next/link';
import { getAllCategoriesWithCount } from '@/lib/mdLoader';
import { formatCategoryName } from '@/lib/utils';

export const HeaderNavigation = async () => {
  const categories = await getAllCategoriesWithCount();

  return (
    <nav aria-label="カテゴリナビゲーション">
      <ul className="flex gap-3">
        {categories.map((category) => (
          <li key={category.name}>
            <Link
              href={`/${category.name}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <span>{formatCategoryName(category.name)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
