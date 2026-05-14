export function formatCategoryName(category: string): string {
  switch (category) {
    case 'css':
      return 'CSS';
    case 'html':
      return 'HTML';
    case 'typescript':
      return 'TypeScript';
    default:
      return category.charAt(0).toUpperCase() + category.slice(1);
  }
}
