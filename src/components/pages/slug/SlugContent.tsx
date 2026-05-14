import { H1 } from '@/components/ui/H1';
import { DateList } from '@/components/ui/DateList';
import { Frontmatter } from '@/types/frontmatter';
import { ArticleContent } from './ArticleContent';

interface CategoryContentProps {
  frontmatter: Frontmatter;
  content: string;
}

export const SlugContent = ({ frontmatter, content }: CategoryContentProps) => {
  return (
    <>
      <H1>{frontmatter.title}</H1>
      <DateList
        publishDate={frontmatter.publishDate}
        updatedDate={frontmatter.updatedDate}
      />
      <ArticleContent content={content} />
    </>
  );
};
