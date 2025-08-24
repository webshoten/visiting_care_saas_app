import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface StaffFormData {
  addId: null | string;
  name: string;
  staffId: string;
  address: string;
  qualification: '介護福祉士' | '初任者' | '実務者' | '看護師' | '';
}

const initialForm: StaffFormData = {
  addId: null,
  name: '',
  staffId: '',
  address: '',
  qualification: '',
};

export function AddStaffButton({
  onSubmit,
}: {
  onSubmit: (form: StaffFormData) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<StaffFormData>(initialForm);

  const update = (key: keyof StaffFormData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  type AddStaffInput = Pick<
    StaffFormData,
    'name' | 'staffId' | 'address' | 'qualification'
  >;
  type StaffCreated = AddStaffInput & {
    id: string;
    createdAt: string;
    updatedAt: string;
  };

  // TODO: サーバー実装後にGraphQL Mutationへ置き換え
  const executeAddStaff = async (
    input: AddStaffInput,
  ): Promise<StaffCreated> => {
    const now = new Date().toISOString();
    const id = `staff_${Date.now()}`;
    return { ...input, id, createdAt: now, updatedAt: now };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.staffId || !form.address || !form.qualification)
      return;
    const created = await executeAddStaff({
      name: form.name,
      staffId: form.staffId,
      address: form.address,
      qualification: form.qualification,
    });
    setForm((prev) => ({ ...prev, addId: created.id }));
    setOpen(false);
  };

  useEffect(() => {
    if (open) setForm(initialForm);
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: submit is intentionally triggered only when addId changes
  useEffect(() => {
    if (form.addId != null) {
      onSubmit(form);
    }
  }, [form.addId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-600/90 text-white">
          スタッフを追加
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>スタッフ登録</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">名前 *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="山田 太郎"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staffId">スタッフID *</Label>
              <Input
                id="staffId"
                value={form.staffId}
                onChange={(e) => update('staffId', e.target.value)}
                placeholder="STF-0001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">住所 *</Label>
              <Input
                id="address"
                name="address"
                autoComplete="street-address"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="〒123-4567 東京都渋谷区..."
              />
            </div>
            <div className="space-y-2">
              <Label>主資格種別 *</Label>
              <Select
                value={form.qualification}
                onValueChange={(v) => update('qualification', v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="介護福祉士">介護福祉士</SelectItem>
                  <SelectItem value="初任者">初任者</SelectItem>
                  <SelectItem value="実務者">実務者</SelectItem>
                  <SelectItem value="看護師">看護師</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-600/90 text-white"
            >
              登録する
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
