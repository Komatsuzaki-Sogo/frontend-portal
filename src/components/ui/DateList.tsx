import { shouldShowUpdatedDate } from '@/lib/utils';

interface DateListProps {
  publishDate: string;
  updatedDate?: string;
}

export const DateList = ({ publishDate, updatedDate }: DateListProps) => {
  const showUpdated = shouldShowUpdatedDate(publishDate, updatedDate);

  return (
    <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
      <div className="flex gap-1">
        <dt>公開日:</dt>
        <dd>
          <time dateTime={new Date(publishDate).toISOString()}>
            {new Date(publishDate).toLocaleDateString('ja-JP')}
          </time>
        </dd>
      </div>
      {showUpdated && updatedDate && (
        <div className="flex gap-1">
          <dt>最終更新日:</dt>
          <dd>
            <time dateTime={new Date(updatedDate!).toISOString()}>
              {new Date(updatedDate!).toLocaleDateString('ja-JP')}
            </time>
          </dd>
        </div>
      )}
    </dl>
  );
};
