'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '../common/DatePicker';

export default function CreateScheduleDialog({
  open = false,
  onOpenChange = (_: boolean) => {},
  onCreate = (_: { id: string; time: string }) => {},
}) {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('09:00');

  function handleCreate() {
    if (!time) return;
    const id = `B${Math.floor(100 + Math.random() * 900)}`;
    onCreate({
      id,
      time,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>新規予約</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-3 items-center gap-3">
            <DatePicker
              date={date}
              onDateChange={setDate}
              placeholder="日付を選択してください"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-3">
            <Label htmlFor="time" className="text-right">
              時間
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="col-span-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button
            className="bg-emerald-600 text-white hover:bg-emerald-600/90"
            onClick={handleCreate}
            disabled={!time}
          >
            追加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
