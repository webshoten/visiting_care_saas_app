'use client';

import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Edit,
  Mail,
  MapPin,
  Phone,
  Trash2,
  User,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useClient } from 'urql';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { calculateAge } from '@/lib/date';
import { executeTypedMutation, useTypedQuery } from '@/lib/genql-urql-bridge';
import {
  AddCareRecipientButton,
  type CareRecipientFormData,
} from './AddCareRecipientButton';

export interface TableList {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  allergies: string;
  medicalHistory: string;
  medications: string;
}

export const CareRecipientCard = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [tableList, setTableList] = useState<Record<string, TableList>>({});
  const PAGE_SIZE = 5;

  const [pages, setPages] = useState<
    { items: ApiCareRecipient[]; nextToken: string | null }[]
  >([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [tokenForFetch, setTokenForFetch] = useState<string | null>(null);
  const lastAppendedKeyRef = React.useRef<string | null>(null);
  const tokenKeyConst = '__FIRST__';
  const getTokenKey = React.useCallback(
    (t: string | null) => (t == null ? tokenKeyConst : t),
    [],
  );

  type ApiCareRecipient = {
    id: string | null | undefined;
    firstName: string | null | undefined;
    lastName: string | null | undefined;
    birthDate: string | null | undefined;
    gender: string | null | undefined;
    phone: string | null | undefined;
    email: string | null | undefined;
    address: string | null | undefined;
    allergies: string | null | undefined;
    medicalHistory: string | null | undefined;
    medications: string | null | undefined;
  };

  const [{ data, fetching }] = useTypedQuery({
    query: {
      listCareRecipients: {
        __args: { limit: PAGE_SIZE, nextToken: tokenForFetch },
        items: {
          id: true,
          firstName: true,
          lastName: true,
          birthDate: true,
          gender: true,
          phone: true,
          email: true,
          address: true,
          allergies: true,
          medicalHistory: true,
          medications: true,
        },
        nextToken: true,
      },
    },
    requestPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (fetching || !data) return;

    const raw = (data.listCareRecipients?.items ?? []) as ApiCareRecipient[];
    const items = (raw.filter(Boolean) as ApiCareRecipient[]) ?? [];
    const next = data.listCareRecipients?.nextToken ?? null;
    const key = getTokenKey(tokenForFetch);
    if (lastAppendedKeyRef.current === key) return;
    setPages((prevPages) => {
      const newPages = [...prevPages, { items, nextToken: next }];
      setCurrentPageIndex(newPages.length - 1);
      lastAppendedKeyRef.current = key;
      return newPages;
    });
  }, [data, fetching, tokenForFetch, getTokenKey]);

  // 現在ページのitemsからテーブル表示データを構築（置換）
  useEffect(() => {
    const page = pages[currentPageIndex];
    if (!page) return;
    const items = page.items ?? [];
    const map = items.reduce(
      (acc: Record<string, TableList>, it: ApiCareRecipient) => {
        if (!it?.id) return acc;
        acc[it.id] = {
          id: it.id,
          name: `${it.firstName ?? ''} ${it.lastName ?? ''}`.trim(),
          age: it.birthDate ? calculateAge(it.birthDate) : 0,
          gender: typeof it.gender === 'string' ? it.gender : '',
          phone: it.phone ?? '',
          email: it.email ?? '',
          address: it.address ?? '',
          allergies: it.allergies ?? '',
          medicalHistory: it.medicalHistory ?? '',
          medications: it.medications ?? '',
        };
        return acc;
      },
      {} as Record<string, TableList>,
    );
    setTableList(map);
  }, [pages, currentPageIndex]);

  // ページ移動ハンドラ
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

  const urqlClient = useClient();

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedRows(newExpanded);
  };

  const handleEdit = (id: string) => {
    console.log('[v0] Edit care recipient:', id);
  };

  const handleDelete = (id: string) => {
    console.log('[v0] Delete care recipient:', id);
  };

  const handleSubmit = async (formData: CareRecipientFormData) => {
    if (formData.addId == null) return;
    const created = (
      await executeTypedMutation(urqlClient, {
        addCareRecipient: {
          __args: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            firstNameKana: formData.firstNameKana,
            lastNameKana: formData.lastNameKana,
            bloodType: formData.bloodType,
            gender: formData.gender,
            birthDate: formData.birthDate,
            email: formData.email ?? undefined,
            medicalHistory: formData.medicalHistory ?? undefined,
            medications: formData.medications ?? undefined,
            phone: formData.phone,
            address: formData.address ?? undefined,
            allergies: formData.allergies ?? undefined,
            notes: formData.notes ?? undefined,
          },
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          updatedAt: true,
        },
      })
    ).data?.addCareRecipient;
    if (!created?.id) return;

    // 1ページ目から再取得
    setPages([]);
    setCurrentPageIndex(0);
    setTokenForFetch(null);
    lastAppendedKeyRef.current = null;
    setExpandedRows(new Set());
  };

  return (
    <>
      {Object.keys(tableList).length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>ケア対象者</CardTitle>
            <AddCareRecipientButton onSubmit={handleSubmit} />
          </CardHeader>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 text-lg">
              まだケア対象者が登録されていません
            </p>
            <p className="text-gray-400 text-sm mt-2">
              上のボタンから新しいケア対象者を追加してください
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>ケア対象者一覧</CardTitle>
            <AddCareRecipientButton onSubmit={handleSubmit} />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12" />
                    <TableHead>名前</TableHead>
                    <TableHead>年齢・性別</TableHead>
                    <TableHead>電話番号</TableHead>
                    <TableHead className="text-right">アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.keys(tableList).map((id) => (
                    <React.Fragment key={id}>
                      <TableRow key={id} className="hover:bg-gray-50">
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(id)}
                            className="p-1 h-8 w-8"
                          >
                            {expandedRows.has(id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>

                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-semibold text-gray-900">
                              {tableList[id].name}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {tableList[id].age}歳
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {tableList[id].gender === 'male'
                                ? '男性'
                                : '女性'}
                            </Badge>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {tableList[id].phone}
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>

                      {expandedRows.has(id) && (
                        <TableRow>
                          <TableCell colSpan={5} className="bg-gray-50 p-0">
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* 連絡先情報 */}
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    連絡先情報
                                  </h4>
                                  <div className="space-y-1 text-sm">
                                    {tableList[id].email && (
                                      <p className="flex items-center gap-1">
                                        <Mail className="h-3 w-3 text-gray-400" />
                                        {tableList[id].email}
                                      </p>
                                    )}
                                    <p className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3 text-gray-400" />
                                      {tableList[id].address}
                                    </p>
                                  </div>
                                </div>

                                {/* 緊急連絡先（PoCでは非表示） */}

                                {/* 医療情報 */}
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-1">
                                    <AlertTriangle className="h-4 w-4" />
                                    医療情報
                                  </h4>
                                  <div className="space-y-1 text-sm">
                                    {tableList[id].allergies &&
                                      tableList[id].allergies !== 'なし' && (
                                        <p className="text-red-600">
                                          <span className="font-medium">
                                            アレルギー:
                                          </span>{' '}
                                          {tableList[id].allergies}
                                        </p>
                                      )}
                                    {tableList[id].medicalHistory && (
                                      <p className="text-gray-600">
                                        <span className="font-medium">
                                          既往歴:
                                        </span>{' '}
                                        {tableList[id].medicalHistory}
                                      </p>
                                    )}
                                    {tableList[id].medications && (
                                      <p className="text-gray-600">
                                        <span className="font-medium">
                                          服薬:
                                        </span>{' '}
                                        {tableList[id].medications}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  ページ {currentPageIndex + 1}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goPrev}
                    disabled={fetching || currentPageIndex === 0}
                  >
                    前へ
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goNext}
                    disabled={
                      fetching ||
                      !pages[currentPageIndex] ||
                      !pages[currentPageIndex].nextToken
                    }
                  >
                    次へ
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
