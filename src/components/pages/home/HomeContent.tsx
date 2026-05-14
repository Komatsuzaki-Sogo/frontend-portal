import { H1 } from '@/components/ui/H1';
import { Text } from '@/components/ui/Text';
import type { CategoryListProps } from '@/types/categoryInfo';
import { CategoryList } from '@/components//pages/home/CategoryList';

export const HomeContent = ({ categories }: CategoryListProps) => {
  return (
    <>
      <H1>フロントエンド ポータル</H1>
      <Text>カテゴリーを選択してください：</Text>
      <CategoryList categories={categories} />
    </>
  );
};
