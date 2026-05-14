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

export function shouldShowUpdatedDate(
  publishDate: string,
  updatedDate?: string,
): boolean {
  if (!updatedDate) return false;
  const normalizeDate = (date: string) =>
    new Date(date).toISOString().split('T')[0];
  return normalizeDate(publishDate) !== normalizeDate(updatedDate);
}
