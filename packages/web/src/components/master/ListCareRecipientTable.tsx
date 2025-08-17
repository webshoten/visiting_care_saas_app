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
import { useState } from 'react';
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
import { AddCareRecipientButton } from './AddCareRecipientButton';

// サンプルデータ（実際のアプリケーションではAPIから取得）
const sampleCareRecipients = [
  {
    id: 1,
    name: '田中 太郎',
    age: 75,
    gender: '男性',
    phone: '090-1234-5678',
    email: 'tanaka@example.com',
    address: '東京都渋谷区1-2-3',
    emergencyContact: '田中 花子',
    emergencyPhone: '090-8765-4321',
    allergies: 'ペニシリン',
    medicalHistory: '高血圧、糖尿病',
    medications: '降圧剤、血糖降下薬',
  },
  {
    id: 2,
    name: '佐藤 花子',
    age: 68,
    gender: '女性',
    phone: '080-9876-5432',
    email: 'sato@example.com',
    address: '東京都新宿区4-5-6',
    emergencyContact: '佐藤 次郎',
    emergencyPhone: '080-1111-2222',
    allergies: 'なし',
    medicalHistory: '関節炎',
    medications: '消炎鎮痛剤',
  },
  {
    id: 3,
    name: '山田 一郎',
    age: 82,
    gender: '男性',
    phone: '070-5555-6666',
    email: '',
    address: '東京都世田谷区7-8-9',
    emergencyContact: '山田 美子',
    emergencyPhone: '070-7777-8888',
    allergies: '卵、牛乳',
    medicalHistory: '心疾患、認知症初期',
    medications: '心臓薬、認知症薬',
  },
];

export const ListCareRecipientTable = () => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleEdit = (id: number) => {
    console.log('[v0] Edit care recipient:', id);
    // 編集機能の実装
  };

  const handleDelete = (id: number) => {
    console.log('[v0] Delete care recipient:', id);
    // 削除機能の実装
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          登録済みケア対象者 ({sampleCareRecipients.length}名)
        </h2>

        <AddCareRecipientButton
          onSubmit={(formData) => {
            console.log(formData);
            debugger;
          }}
        />
      </div>

      {sampleCareRecipients.length === 0 ? (
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
                  {sampleCareRecipients.map((recipient) => (
                    <>
                      <TableRow key={recipient.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(recipient.id)}
                            className="p-1 h-8 w-8"
                          >
                            {expandedRows.has(recipient.id) ? (
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
                              {recipient.name}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {recipient.age}歳
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {recipient.gender}
                            </Badge>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {recipient.phone}
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(recipient.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(recipient.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>

                      {expandedRows.has(recipient.id) && (
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
                                    {recipient.email && (
                                      <p className="flex items-center gap-1">
                                        <Mail className="h-3 w-3 text-gray-400" />
                                        {recipient.email}
                                      </p>
                                    )}
                                    <p className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3 text-gray-400" />
                                      {recipient.address}
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
                                      {recipient.emergencyContact}
                                    </p>
                                    <p className="flex items-center gap-1 text-gray-600">
                                      <Phone className="h-3 w-3" />
                                      {recipient.emergencyPhone}
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
                                    {recipient.allergies &&
                                      recipient.allergies !== 'なし' && (
                                        <p className="text-red-600">
                                          <span className="font-medium">
                                            アレルギー:
                                          </span>{' '}
                                          {recipient.allergies}
                                        </p>
                                      )}
                                    {recipient.medicalHistory && (
                                      <p className="text-gray-600">
                                        <span className="font-medium">
                                          既往歴:
                                        </span>{' '}
                                        {recipient.medicalHistory}
                                      </p>
                                    )}
                                    {recipient.medications && (
                                      <p className="text-gray-600">
                                        <span className="font-medium">
                                          服薬:
                                        </span>{' '}
                                        {recipient.medications}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
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
