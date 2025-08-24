'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CareRecipientCard } from './CareRecipientCard';

export const MasterTables = () => {
  const [activeTab, setActiveTab] = useState<
    'ケア対象者' | 'スタッフ' | 'サービス' | '事業所'
  >('ケア対象者');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">マスター管理</h2>
        <div role="tablist" className="flex gap-2">
          {['ケア対象者', 'スタッフ', 'サービス', '事業所'].map((label) => (
            <button
              key={label}
              role="tab"
              aria-selected={activeTab === label}
              type="button"
              onClick={() => setActiveTab(label as typeof activeTab)}
              className={`px-3 py-1.5 text-sm rounded-md border transition ${
                activeTab === label
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'ケア対象者' ? (
        <CareRecipientCard />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{activeTab}（準備中）</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              このマスターは現在準備中です。
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
