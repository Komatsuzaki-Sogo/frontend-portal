import { getAllCategoriesWithCount, getDocsByCategory } from '@/lib/mdLoader';
import { formatCategoryName } from '@/lib/formatCategoryName';
import { notFound } from 'next/navigation';
import { BreadcrumbSetter } from '@/components/ui/BreadcrumbSetter';
import { CategoryContent } from '@/components/pages/category/CategoryContent';
import { ButtonBack } from '@/components/ui/ButtonBack';

interface Props {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  const categories = await getAllCategoriesWithCount();

  return categories.map((category) => ({
    category: category.name,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const categoryDisplayName = formatCategoryName(category);
  return {
    title: `${categoryDisplayName} - ドキュメント`,
    description: `${categoryDisplayName}カテゴリーのドキュメント一覧`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const docs = await getDocsByCategory(category);

  if (docs.length === 0) {
    notFound();
  }

  const categoryDisplayName = formatCategoryName(category);

  return (
    <>
      <BreadcrumbSetter
        items={[{ text: 'ホーム', href: '/' }, { text: categoryDisplayName }]}
      />
      <CategoryContent docs={docs} categoryDisplayName={categoryDisplayName} />
      <ButtonBack text="ホームに戻る" href="/" />
    </>
  );
}
