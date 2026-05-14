import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { CodeBlock } from '@/components/ui/CodeBlock';
import type { Components } from 'react-markdown';

interface ArticleContentProps {
  content: string;
}

export const ArticleContent = ({ content }: ArticleContentProps) => {
  return (
    <article className="prose prose-lg max-w-none mdContent">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={
          {
            code({ className, children }) {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : 'plaintext';
              const isInline = !match;

              return isInline ? (
                <code className={className}>{children}</code>
              ) : (
                <CodeBlock
                  language={language}
                  code={String(children).replace(/\n$/, '')}
                />
              );
            },
          } as Components
        }
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};
