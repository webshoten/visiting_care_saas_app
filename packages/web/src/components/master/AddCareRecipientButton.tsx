'use client';

import {
  AlertTriangleIcon,
  CalendarIcon,
  HeartIcon,
  PhoneIcon,
  PlusIcon,
  UserIcon,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

export interface CareRecipientFormData {
  addId: null | string;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  birthDate: string;
  gender: string;
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  allergies: string;
  medications: string;
  medicalHistory: string;
  notes: string;
}

const initialFormData = {
  addId: null,

  // 基本情報
  lastName: '',
  firstName: '',
  lastNameKana: '',
  firstNameKana: '',
  birthDate: '',
  gender: '',
  bloodType: '',

  // 連絡先情報
  phone: '',
  email: '',
  address: '',

  // 緊急連絡先
  emergencyContactName: '',
  emergencyContactRelation: '',
  emergencyContactPhone: '',

  // 医療情報
  allergies: '',
  medications: '',
  medicalHistory: '',
  notes: '',
};

export const AddCareRecipientButton = ({
  onSubmit,
}: {
  onSubmit: (formData: CareRecipientFormData) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] =
    useState<CareRecipientFormData>(initialFormData);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = uuidv4();
    setFormData((prev) => ({ ...prev, addId: id }));
    setOpen(false);
    // ここで実際の登録処理を行う
  };

  //初期化
  useEffect(() => {
    if (open === true) {
      setFormData(initialFormData);
    }
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (formData.addId != null) {
      console.log('患者情報:', formData);
      onSubmit(formData);
    }
  }, [formData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-600/90 text-white">
          <PlusIcon className="h-4 w-4" />
          ケア対象者を追加
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <UserIcon className="h-6 w-6 text-primary" />
            ケア対象者登録
          </DialogTitle>
          <p className="text-muted-foreground">
            新しいケア対象者の情報を入力してください
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 基本情報セクション */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <UserIcon className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">基本情報</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastName">姓 *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange('lastName', e.target.value)
                  }
                  placeholder="山田"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">名 *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange('firstName', e.target.value)
                  }
                  placeholder="太郎"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastNameKana">セイ *</Label>
                <Input
                  id="lastNameKana"
                  value={formData.lastNameKana}
                  onChange={(e) =>
                    handleInputChange('lastNameKana', e.target.value)
                  }
                  placeholder="ヤマダ"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstNameKana">メイ *</Label>
                <Input
                  id="firstNameKana"
                  value={formData.firstNameKana}
                  onChange={(e) =>
                    handleInputChange('firstNameKana', e.target.value)
                  }
                  placeholder="タロウ"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">生年月日 *</Label>
                <div className="relative">
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      handleInputChange('birthDate', e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">性別 *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">男性</SelectItem>
                    <SelectItem value="female">女性</SelectItem>
                    <SelectItem value="other">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType">血液型</Label>
                <Select
                  value={formData.bloodType}
                  onValueChange={(value) =>
                    handleInputChange('bloodType', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A型</SelectItem>
                    <SelectItem value="B">B型</SelectItem>
                    <SelectItem value="AB">AB型</SelectItem>
                    <SelectItem value="O">O型</SelectItem>
                    <SelectItem value="unknown">不明</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* 連絡先情報セクション */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <PhoneIcon className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">連絡先情報</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">電話番号</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="090-1234-5678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">住所</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="〒123-4567 東京都渋谷区..."
              />
            </div>
          </div>

          <Separator />

          {/* 緊急連絡先セクション */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangleIcon className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">緊急連絡先</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">氏名 *</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) =>
                    handleInputChange('emergencyContactName', e.target.value)
                  }
                  placeholder="緊急連絡先の氏名"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelation">続柄 *</Label>
                <Select
                  value={formData.emergencyContactRelation}
                  onValueChange={(value) =>
                    handleInputChange('emergencyContactRelation', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">配偶者</SelectItem>
                    <SelectItem value="parent">親</SelectItem>
                    <SelectItem value="child">子</SelectItem>
                    <SelectItem value="sibling">兄弟姉妹</SelectItem>
                    <SelectItem value="relative">親族</SelectItem>
                    <SelectItem value="friend">友人</SelectItem>
                    <SelectItem value="other">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">電話番号 *</Label>
                <Input
                  id="emergencyContactPhone"
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) =>
                    handleInputChange('emergencyContactPhone', e.target.value)
                  }
                  placeholder="090-1234-5678"
                  required
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* 医療情報セクション */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <HeartIcon className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">医療情報</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="allergies">アレルギー</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) =>
                    handleInputChange('allergies', e.target.value)
                  }
                  placeholder="食物アレルギー、薬物アレルギーなど"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">現在の服薬</Label>
                <Textarea
                  id="medications"
                  value={formData.medications}
                  onChange={(e) =>
                    handleInputChange('medications', e.target.value)
                  }
                  placeholder="現在服用中の薬剤名、用法用量など"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalHistory">既往歴</Label>
                <Textarea
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) =>
                    handleInputChange('medicalHistory', e.target.value)
                  }
                  placeholder="過去の病歴、手術歴など"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">特記事項</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="その他の重要な情報"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              className="px-8 bg-emerald-600 hover:bg-emerald-600/90 text-white"
            >
              登録する
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
