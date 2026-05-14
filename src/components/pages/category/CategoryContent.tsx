import Link from 'next/link';
import { H1 } from '@/components/ui/H1';
import { Text } from '@/components/ui/Text';
import type { DocMeta } from '@/types/docMeta';
import { DocList } from '@/components/pages/category/DocList';

interface CategoryContentProps {
  docs: DocMeta[];
  categoryDisplayName: string;
}

export const CategoryContent = ({
  docs,
  categoryDisplayName,
}: CategoryContentProps) => {
  return (
    <>
      <H1>{categoryDisplayName} ドキュメント</H1>
      <Text>{docs.length}件の記事があります。</Text>
      <DocList docs={docs} />
    </>
  );
};
