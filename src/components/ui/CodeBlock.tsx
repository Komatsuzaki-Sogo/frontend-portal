'use client';

import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

interface CodeBlockProps {
  language: string;
  code: string;
}

/**
 * シンタックスハイライト付きコードブロック
 * highlight.jsを使用してコードをハイライト
 */
export const CodeBlock = ({ language, code }: CodeBlockProps) => {
  let highlightedCode = code;

  try {
    if (hljs.getLanguage(language)) {
      highlightedCode = hljs.highlight(code, {
        language,
        ignoreIllegals: true,
      }).value;
    } else {
      highlightedCode = hljs.highlight(code, { language: 'plaintext' }).value;
    }
  } catch (error) {
    console.error(`Failed to highlight code for language ${language}:`, error);
    highlightedCode = code;
  }

  const lineNumbers = code.replace(/\n$/, '').split('\n');

  return (
    <div className="flex">
      <div className="hidden min-w-8 flex-col gap-0.5 border-r border-slate-800 bg-slate-950 mr-2 p-2 text-right text-xs text-slate-500 md:flex">
        {lineNumbers.map((_, index) => (
          <span key={index} className="block leading-6 select-none">
            {index + 1}
          </span>
        ))}
      </div>
      <code
        className={`language-${language} w-full py-2`}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </div>
  );
};
