import { notFound } from 'next/navigation';
import { getMdFile, getAllMdPaths } from '@/lib/mdLoader';
import { formatCategoryName } from '@/lib/formatCategoryName';
import type { Frontmatter } from '@/types/frontmatter';
import { ButtonBack } from '@/components/ui/ButtonBack';
import { BreadcrumbSetter } from '@/components/ui/BreadcrumbSetter';
import { SlugContent } from '@/components/pages/slug/SlugContent';

interface Props {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const paths = await getAllMdPaths();
  return paths.map((filePath) => ({
    slug: filePath.split('/'),
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const filePath = `${slug.join('/')}.md`;
  const file = await getMdFile(filePath);

  if (!file) {
    return {
      title: 'Not Found',
    };
  }

  const frontmatter: Frontmatter = file.frontmatter;

  return {
    title: frontmatter.title || 'Document',
    description: `${frontmatter.title}について説明しているページです。`,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const filePath = `${slug.join('/')}.md`;
  const file = await getMdFile(filePath);

  if (!file) {
    notFound();
  }

  const frontmatter: Frontmatter = file.frontmatter;

  const breadcrumbItems = [
    { text: 'ホーム', href: '/' },
    { text: formatCategoryName(slug[0]), href: `/${slug[0]}` },
    { text: frontmatter.title },
  ];

  return (
    <>
      <BreadcrumbSetter items={breadcrumbItems} />
      <SlugContent frontmatter={frontmatter} content={file.content} />
      <ButtonBack />
    </>
  );
}
