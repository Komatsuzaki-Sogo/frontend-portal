'use client';

import { useEffect } from 'react';
import { useBreadcrumb } from '@/providers/BreadcrumbProvider';
import type { BreadcrumbProps } from '@/types/breadcrumb';

/**
 * パンくずリストの内容をContextに設定するコンポーネント
 * Server Componentから呼び出される際は、propsで items を指定する
 * @param items - 表示するパンくずアイテムの配列
 */
export const BreadcrumbSetter = ({ items }: BreadcrumbProps) => {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs(items);
  }, [items, setBreadcrumbs]);

  return null;
};
