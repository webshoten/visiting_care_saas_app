'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddStaffButton, type StaffFormData } from './AddStaffButton';

export const StaffCard = () => {
  const [rows, setRows] = useState<StaffFormData[]>([]);

  const handleSubmit = async (form: StaffFormData) => {
    // TODO: Mutation 実装予定
    console.log('submit staff', form);
    setRows((prev) => [{ ...form }, ...prev]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>スタッフ</CardTitle>
        <AddStaffButton onSubmit={handleSubmit} />
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
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
                {rows.map((r) => (
                  <tr
                    key={r.addId ?? `${r.staffId}-${r.name}`}
                    className="border-t"
                  >
                    <td className="py-2 px-1">{r.name}</td>
                    <td className="py-2 px-1">{r.staffId}</td>
                    <td className="py-2 px-1">{r.address}</td>
                    <td className="py-2 px-1">{r.qualification}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
