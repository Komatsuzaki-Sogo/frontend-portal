import Link from 'next/link';
import type { DocMeta } from '@/types/docMeta';
import { DateList } from '@/components/ui/DateList';

const DocItem = ({ doc }: { doc: DocMeta }) => {
  return (
    <Link
      href={`/${doc.path}/`}
      className="block text-blue-600 border rounded-lg p-4 transition hover:shadow-lg hover:text-blue-800 group"
    >
      <p className="text-xl font-semibold">{doc.frontmatter.title}</p>

      <DateList
        publishDate={doc.frontmatter.publishDate}
        updatedDate={doc.frontmatter.updatedDate}
      />
    </Link>
  );
};

interface DocListProps {
  docs: DocMeta[];
}

export const DocList = ({ docs }: DocListProps) => {
  return (
    <ul className="space-y-4 list-none mt-8">
      {docs.map((doc) => (
        <li key={doc.path}>
          <DocItem doc={doc} />
        </li>
      ))}
    </ul>
  );
};
