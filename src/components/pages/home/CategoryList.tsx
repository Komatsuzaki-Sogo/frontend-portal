import Link from 'next/link';
import { formatCategoryName } from '@/lib/formatCategoryName';
import type { CategoryInfo, CategoryListProps } from '@/types/categoryInfo';

const CategoryItem = ({ category }: { category: CategoryInfo }) => {
  return (
    <Link
      href={`/${category.name}/`}
      className="flex justify-between items-center p-4 border border-gray-300 rounded-lg no-underline text-blue-600 hover:bg-gray-50 transition-colors group"
    >
      <span className="text-lg font-bold group-hover:text-blue-800">
        {formatCategoryName(category.name)} 一覧
      </span>
      <span className="text-sm bg-gray-100 text-gray-600 py-1 px-3 rounded-full">
        {category.count} 件
      </span>
    </Link>
  );
};

export const CategoryList = ({ categories }: CategoryListProps) => {
  return (
    <ul className="grid gap-4 list-none mt-8 md:grid-cols-2">
      {categories.map((category) => (
        <li key={category.name}>
          <CategoryItem category={category} />
        </li>
      ))}
    </ul>
  );
};
