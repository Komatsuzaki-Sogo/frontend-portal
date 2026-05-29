'use client';

import { useState } from 'react';
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
  const [copyStatus, setCopyStatus] = useState<'copy' | 'copied' | 'failed'>('copy');

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus('copied');
    } catch (error) {
      console.error('Code copy failed:', error);
      setCopyStatus('failed');
    }

    window.setTimeout(() => setCopyStatus('copy'), 2000);
  };

  return (
    <div className="relative rounded-2xl text-slate-100">
      <div className="absolute right-3 top-3 z-10 w-fit">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-slate-500 bg-slate-900/90 px-3 py-1 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
        >
          {copyStatus === 'copied' ? 'Copied' : copyStatus === 'failed' ? 'Failed' : 'Copy'}
        </button>
      </div>

      <div className="flex py-2">
        <div className="flex min-w-[2.25rem] flex-col border-r border-slate-900 pr-2 text-right text-xs text-slate-500 md:flex">
          {lineNumbers.map((_, index) => (
            <span key={index} className="block leading-6 select-none">
              {index + 1}
            </span>
          ))}
        </div>

        <code
          className={`language-${language} block`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
    </div>
  );
};
