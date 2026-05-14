import type { Frontmatter } from '@/types/frontmatter';

export type MdFile = {
  frontmatter: Frontmatter;
  content: string;
};
