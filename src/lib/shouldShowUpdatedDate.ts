export function shouldShowUpdatedDate(
  publishDate: string,
  updatedDate?: string,
): boolean {
  if (!updatedDate) return false;
  const normalizeDate = (date: string) =>
    new Date(date).toISOString().split('T')[0];
  return normalizeDate(publishDate) !== normalizeDate(updatedDate);
}
