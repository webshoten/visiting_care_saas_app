'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useClient } from 'urql';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { executeTypedMutation, useTypedQuery } from '@/lib/genql-urql-bridge';
import { AddStaffButton, type StaffFormData } from './AddStaffButton';

type ApiStaff = {
  id: string | null | undefined;
  name: string | null | undefined;
  staffId: string | null | undefined;
  address: string | null | undefined;
  qualification: string | null | undefined;
};

export const StaffCard = () => {
  const PAGE_SIZE = 5;
  const [pages, setPages] = useState<
    { items: ApiStaff[]; nextToken: string | null }[]
  >([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [tokenForFetch, setTokenForFetch] = useState<string | null>(null);
  const lastAppendedKeyRef = React.useRef<string | null>(null);
  const tokenKeyConst = '__FIRST__';
  const getTokenKey = React.useCallback(
    (t: string | null) => (t == null ? tokenKeyConst : t),
    [],
  );

  const ctx = useMemo(() => ({ additionalTypenames: ['Staff'] }), []);
  const [{ data, fetching }] = useTypedQuery({
    query: {
      listStaff: {
        __args: { limit: PAGE_SIZE, nextToken: tokenForFetch },
        items: {
          id: true,
          name: true,
          staffId: true,
          address: true,
          qualification: true,
        },
        nextToken: true,
        __typename: true,
      },
    },
    requestPolicy: 'network-only',
    context: ctx,
  });

  useEffect(() => {
    if (fetching || !data) return;
    const raw = (data.listStaff?.items ?? []) as ApiStaff[];
    const items = (raw.filter(Boolean) as ApiStaff[]) ?? [];
    const next = data.listStaff?.nextToken ?? null;
    const key = getTokenKey(tokenForFetch);
    if (lastAppendedKeyRef.current === key) return;
    setPages((prev) => {
      const newPages = [...prev, { items, nextToken: next }];
      lastAppendedKeyRef.current = key;
      setCurrentPageIndex(newPages.length - 1);
      return newPages;
    });
  }, [data, fetching, tokenForFetch, getTokenKey]);

  const urqlClient = useClient();

  const handleSubmit = async (form: StaffFormData) => {
    const created = (
      await executeTypedMutation(urqlClient, {
        addStaff: {
          __args: {
            name: form.name,
            staffId: form.staffId,
            address: form.address,
            qualification: form.qualification,
          },
          id: true,
          name: true,
          staffId: true,
          address: true,
          qualification: true,
          createdAt: true,
          updatedAt: true,
          __typename: true,
        },
      })
    ).data?.addStaff as { id: string } | undefined;
    if (!created?.id) return;

    // 追加後は1ページ目から再取得（整合性優先）
    setPages([]);
    setCurrentPageIndex(0);
    setTokenForFetch(null);
    lastAppendedKeyRef.current = null;
  };

  const goPrev = () => {
    if (fetching) return;
    if (currentPageIndex === 0) return;
    setCurrentPageIndex((i) => i - 1);
  };

  const goNext = () => {
    if (fetching) return;
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex((i) => i + 1);
      return;
    }
    const token = pages[currentPageIndex]?.nextToken ?? null;
    if (!token) return;
    setTokenForFetch(token);
  };

  const currentItems = pages[currentPageIndex]?.items ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>スタッフ</CardTitle>
        <AddStaffButton onSubmit={handleSubmit} />
      </CardHeader>
      <CardContent>
        {currentItems.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500 text-lg">
              まだスタッフが登録されていません
            </p>
            <p className="text-gray-400 text-sm mt-2">
              上のボタンから新しいスタッフを追加してください
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2 px-1">名前</th>
                  <th className="py-2 px-1">スタッフID</th>
                  <th className="py-2 px-1">住所</th>
                  <th className="py-2 px-1">主資格</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((r) => (
                  <tr
                    key={r?.id ?? `${r?.staffId}-${r?.name}`}
                    className="border-t"
                  >
                    <td className="py-2 px-1">{r?.name ?? ''}</td>
                    <td className="py-2 px-1">{r?.staffId ?? ''}</td>
                    <td className="py-2 px-1">{r?.address ?? ''}</td>
                    <td className="py-2 px-1">{r?.qualification ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                ページ {currentPageIndex + 1}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 text-sm rounded-md border"
                  onClick={goPrev}
                  disabled={fetching || currentPageIndex === 0}
                >
                  前へ
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 text-sm rounded-md border"
                  onClick={goNext}
                  disabled={
                    fetching ||
                    !pages[currentPageIndex] ||
                    !pages[currentPageIndex].nextToken
                  }
                >
                  次へ
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
