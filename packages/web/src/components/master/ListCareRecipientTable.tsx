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
import React, { use, useEffect, useState } from 'react';
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
import { useGenQL } from '@/contexts/GenQLContext';
import { calculateAge } from '@/lib/date';
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

export const ListCareRecipientTable = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [tableList, setTableList] = useState<Record<string, TableList>>({
  });
  const { client, loading: genqlLoading } = useGenQL();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!client || genqlLoading) {
      return;
    }
    (async () => {
      const res = await client.query({
        listCareRecipients: {
          __args: {
            limit: 20,
          },
          items: {
            id: true,
            firstName: true,
            lastName: true,
            birthDate: true,
            gender: true,
            phone: true,
            email: true,
            address: true,
            emergencyContactName: true,
            emergencyContactPhone: true,
            allergies: true,
            medicalHistory: true,
            medications: true,
          },
          nextToken: true,
        },
      });

      const items = res?.listCareRecipients?.items ?? [];
      const map = items.reduce<Record<string, TableList>>((acc, it) => {
        if (!it?.id) return acc;
        acc[it.id] = {
          id: it.id,
          name: `${it.firstName ?? ""} ${it.lastName ?? ""}`.trim(),
          age: it.birthDate ? calculateAge(it.birthDate) : 0,
          gender: typeof it.gender === "string" ? it.gender : "",
          phone: it.phone ?? "",
          email: it.email ?? "",
          address: it.address ?? "",
          emergencyContactName: it.emergencyContactName ?? "",
          emergencyContactPhone: it.emergencyContactPhone ?? "",
          allergies: it.allergies ?? "",
          medicalHistory: it.medicalHistory ?? "",
          medications: it.medications ?? "",
        };
        return acc;
      }, {});

      setTableList((prev) => ({
        ...prev,
        ...map,
      }));
    })();
  }, [client]);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleEdit = (id: string) => {
    console.log('[v0] Edit care recipient:', id);
    // 編集機能の実装
  };

  const handleDelete = (id: string) => {
    console.log('[v0] Delete care recipient:', id);
    // 削除機能の実装
  };

  const handleSubmit = async (formData: CareRecipientFormData) => {
    if (!client || genqlLoading) {
      return;
    }
    if (formData.addId == null) return;
    const res = await client?.mutation({
      addCareRecipient: {
        __args: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          firstNameKana: formData.firstNameKana,
          lastNameKana: formData.lastNameKana,
          bloodType: formData.bloodType,
          gender: formData.gender,
          birthDate: formData.birthDate,
          email: formData.email,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactRelation: formData.emergencyContactRelation,
          emergencyContactPhone: formData.emergencyContactPhone,
          medicalHistory: formData.medicalHistory,
          medications: formData.medications,
          phone: formData.phone,
          address: formData.address,
          allergies: formData.allergies,
          notes: formData.notes,
        },
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        updatedAt: true,
      },
    });
    setTableList((prev) => {
      return {
        ...prev,
        [res?.addCareRecipient?.id ?? '']: {
          id: formData.addId ?? '',
          name: `${formData.firstName} ${formData.lastName}`,
          age: calculateAge(formData.birthDate),
          gender: formData.gender,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          emergencyContactName: formData.emergencyContactName,
          emergencyContactPhone: formData.emergencyContactPhone,
          allergies: formData.allergies ?? '',
          medicalHistory: formData.medicalHistory,
          medications: formData.medications,
        },
      };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          ケア対象者 ({Object.keys(tableList).length}名)
        </h2>
      </div>

      {Object.keys(tableList).length === 0 ? (
        <Card>
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

                                {/* 緊急連絡先 */}
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-sm text-gray-700">
                                    緊急連絡先
                                  </h4>
                                  <div className="space-y-1 text-sm">
                                    <p className="font-medium">
                                      {tableList[id].emergencyContactName}
                                    </p>
                                    <p className="flex items-center gap-1 text-gray-600">
                                      <Phone className="h-3 w-3" />
                                      {tableList[id].emergencyContactPhone}
                                    </p>
                                  </div>
                                </div>

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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
