import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Frontmatter } from '@/types/frontmatter';
import type { MdFile } from '@/types/mdFile';
import type { DocMeta } from '@/types/docMeta';

const CONTENT_DIR = path.join(process.cwd(), 'content');

// 表示順を定義する配列
const CATEGORY_ORDER = ['html', 'css', 'typescript'];

/**
 * マークダウンファイルを読み込み、フロントマターとコンテンツを抽出
 * @param filePath - 読み込むマークダウンファイルのパス
 * @returns フロントマターとマークダウンコンテンツを含むMdFileオブジェクト。ファイルが存在しない場合はnull
 */
export async function getMdFile(filePath: string): Promise<MdFile | null> {
  const fullPath = path.join(CONTENT_DIR, filePath);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const { data, content: markdown } = matter(content);

  return {
    frontmatter: data as Frontmatter,
    content: markdown,
  };
}

/**
 * contentディレクトリ配下のすべてのマークダウンファイルのパスを取得
 * @returns ファイルパスの配列
 */
export async function getAllMdPaths() {
  const paths: string[] = [];

  function walkDir(dir: string, basePath: string = '') {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const relativePath = basePath ? `${basePath}/${file}` : file;

      if (fs.statSync(fullPath).isDirectory()) {
        walkDir(fullPath, relativePath);
      } else if (file.endsWith('.md')) {
        const filePath = relativePath.replace(/\\/g, '/').replace(/\.md$/, '');
        paths.push(filePath);
      }
    }
  }

  walkDir(CONTENT_DIR);
  return paths;
}

/**
 * すべてのマークダウンファイルからユニークなカテゴリを取得。CATEGORY_ORDERの定義順でソート
 * @returns カテゴリ名の配列（ソート済み）
 */
export async function getAllCategories() {
  const categories: string[] = [];
  const paths = await getAllMdPaths();
  const seen = new Set<string>();

  for (const filePath of paths) {
    const file = await getMdFile(`${filePath}.md`);
    if (file?.frontmatter.category && !seen.has(file.frontmatter.category)) {
      seen.add(file.frontmatter.category);
      categories.push(file.frontmatter.category);
    }
  }

  return categories.sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a);
    const indexB = CATEGORY_ORDER.indexOf(b);

    // 両方が定義済みの順序に含まれる場合
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    // aのみ定義済みの場合
    if (indexA !== -1) return -1;
    // bのみ定義済みの場合
    if (indexB !== -1) return 1;

    // どちらも定義されていない場合はアルファベット順
    return a.localeCompare(b);
  });
}

/**
 * すべてのマークダウンファイルからカテゴリとそれぞれの件数を取得。
 * CATEGORY_ORDERの定義順でソート
 * @returns { name: string, count: number } の配列
 */
export async function getAllCategoriesWithCount() {
  const categoryMap: Record<string, number> = {};
  const paths = await getAllMdPaths();

  for (const filePath of paths) {
    const file = await getMdFile(`${filePath}.md`);
    const category = file?.frontmatter.category;

    if (category) {
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    }
  }

  const categories = Object.keys(categoryMap).map((name) => ({
    name,
    count: categoryMap[name],
  }));

  return categories.sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a.name);
    const indexB = CATEGORY_ORDER.indexOf(b.name);

    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * 指定されたカテゴリのドキュメントを取得。order属性でソート
 * @param category - フィルタリング対象のカテゴリ名
 * @returns カテゴリに属するドキュメントのメタデータ配列（order順でソート済み）
 */
export async function getDocsByCategory(category: string): Promise<DocMeta[]> {
  const docs: DocMeta[] = [];
  const paths = await getAllMdPaths();

  for (const filePath of paths) {
    const file = await getMdFile(`${filePath}.md`);
    if (!file) continue;

    if (file.frontmatter.category === category) {
      docs.push({
        frontmatter: file.frontmatter,
        path: filePath,
      });
    }
  }

  return docs.sort((a, b) => {
    if (!a.frontmatter.order || !b.frontmatter.order) return 0;
    return a.frontmatter.order - b.frontmatter.order;
  });
}
