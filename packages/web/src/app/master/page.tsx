'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AddCareRecipientButton } from '@/components/master/AddCareRecipientButton';
import { ListCareRecipientTable } from '@/components/master/ListCareRecipientTable';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto ">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">マスター</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ListCareRecipientTable />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
