"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OperationCard } from "@/components/dashboard/OperationCard";
import { useToken } from "@/contexts/TokenContext";

export default function DashboardPage() {
  const { isAuthenticated } = useToken();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto ">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              ダッシュボード
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <OperationCard />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
