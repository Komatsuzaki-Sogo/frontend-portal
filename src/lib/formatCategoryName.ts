export function formatCategoryName(category: string): string {
  switch (category) {
    case 'basic-policy':
      return '基本方針';
    case 'html':
      return 'HTML';
    case 'css':
      return 'CSS';
    case 'typescript':
      return 'TypeScript';
    case 'wordpress':
      return 'WordPress';
    default:
      return category.charAt(0).toUpperCase() + category.slice(1);
  }
}
