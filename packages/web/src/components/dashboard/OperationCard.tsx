import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import CreateScheduleDialog from './CreateScheduleDialog';

export const OperationCard = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">操作系ボタン</h2>
      <p className="text-gray-600">
        <Button
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-600/90 text-white"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          新規予約
        </Button>
      </p>
      <CreateScheduleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={(data) => {
          debugger;
          console.log(data);
        }}
      />
    </div>
  );
};
