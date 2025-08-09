# データ設計書

## 1. データ設計概要

### 設計方針
- **正規化**: 第3正規形までの正規化を基本とする
- **拡張性**: 将来の機能追加に対応できる柔軟な設計
- **性能**: 頻繁なクエリに対する最適化
- **保守性**: 分かりやすいテーブル構造と命名規則

### 主要エンティティ
1. **被介護者（CareRecipients）**: 送迎サービス利用者
2. **ケアラー（Caregivers）**: 送迎サービス提供者
3. **送迎依頼（TransportRequests）**: 送迎の予約・依頼
4. **割り当て（Assignments）**: ケアラーと依頼のマッチング
5. **実績（TransportRecords）**: 送迎の実行履歴

## 2. エンティティ詳細設計

### 2.1 被介護者（CareRecipients）

```sql
CREATE TABLE care_recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- 基本情報
    family_name VARCHAR(50) NOT NULL,
    given_name VARCHAR(50) NOT NULL,
    family_name_kana VARCHAR(100),
    given_name_kana VARCHAR(100),
    date_of_birth DATE,
    gender CHAR(1) CHECK (gender IN ('M', 'F', 'O')),
    
    -- 連絡先情報
    postal_code VARCHAR(8),
    prefecture VARCHAR(10),
    city VARCHAR(50),
    address_line VARCHAR(200),
    building VARCHAR(100),
    phone_number VARCHAR(15),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(15),
    emergency_contact_relation VARCHAR(50),
    
    -- 介護関連情報
    care_level INTEGER CHECK (care_level BETWEEN 1 AND 5),
    care_number VARCHAR(20), -- 介護保険番号
    
    -- システム管理
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT
);
```

### 2.2 被介護者身体情報（CareRecipientPhysicalInfo）

```sql
CREATE TABLE care_recipient_physical_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    care_recipient_id UUID NOT NULL REFERENCES care_recipients(id),
    
    -- 移動能力
    mobility_level VARCHAR(20) CHECK (mobility_level IN ('independent', 'assisted', 'dependent')),
    wheelchair_required BOOLEAN DEFAULT FALSE,
    walking_aid_required BOOLEAN DEFAULT FALSE,
    transfer_assistance_required BOOLEAN DEFAULT FALSE,
    
    -- 身体的特徴
    height_cm INTEGER,
    weight_kg INTEGER,
    lifting_assistance_required BOOLEAN DEFAULT FALSE,
    
    -- 医療情報
    medical_equipment TEXT[], -- 酸素ボンベ等
    medication_management_required BOOLEAN DEFAULT FALSE,
    allergies TEXT,
    
    -- コミュニケーション
    communication_method VARCHAR(20) CHECK (communication_method IN ('verbal', 'sign', 'written', 'limited')),
    cognitive_level VARCHAR(20) CHECK (cognitive_level IN ('normal', 'mild', 'moderate', 'severe')),
    behavioral_concerns TEXT,
    
    -- 送迎特記事項
    special_instructions TEXT,
    preferred_seating_position VARCHAR(20),
    motion_sickness_tendency BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.3 ケアラー（Caregivers）

```sql
CREATE TABLE caregivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- 基本情報
    family_name VARCHAR(50) NOT NULL,
    given_name VARCHAR(50) NOT NULL,
    family_name_kana VARCHAR(100),
    given_name_kana VARCHAR(100),
    date_of_birth DATE,
    gender CHAR(1) CHECK (gender IN ('M', 'F', 'O')),
    
    -- 連絡先情報
    postal_code VARCHAR(8),
    prefecture VARCHAR(10),
    city VARCHAR(50),
    address_line VARCHAR(200),
    building VARCHAR(100),
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(255),
    
    -- 雇用情報
    employee_number VARCHAR(20),
    hire_date DATE,
    employment_status VARCHAR(20) DEFAULT 'active',
    
    -- システム管理
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT
);
```

### 2.4 ケアラー資格情報（CaregiverQualifications）

```sql
CREATE TABLE caregiver_qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caregiver_id UUID NOT NULL REFERENCES caregivers(id),
    
    -- 運転免許
    driving_license_type VARCHAR(20), -- 普通、準中型等
    license_expiry_date DATE,
    
    -- 介護資格
    care_qualifications TEXT[], -- 介護福祉士、ヘルパー1級等
    medical_training TEXT[], -- 救急救命、医療研修等
    language_skills TEXT[], -- 日本語、英語等
    
    -- 身体的能力
    lifting_capacity_kg INTEGER,
    wheelchair_handling_capable BOOLEAN DEFAULT FALSE,
    transfer_skills_certified BOOLEAN DEFAULT FALSE,
    emergency_response_certified BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.5 ケアラー車両情報（CaregiverVehicles）

```sql
CREATE TABLE caregiver_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caregiver_id UUID NOT NULL REFERENCES caregivers(id),
    
    -- 車両基本情報
    vehicle_type VARCHAR(20) CHECK (vehicle_type IN ('sedan', 'wagon', 'van', 'wheelchair_accessible')),
    make VARCHAR(50),
    model VARCHAR(50),
    year INTEGER,
    license_plate VARCHAR(20),
    
    -- 設備・能力
    passenger_capacity INTEGER NOT NULL,
    wheelchair_accessible BOOLEAN DEFAULT FALSE,
    medical_equipment_space BOOLEAN DEFAULT FALSE,
    air_conditioning BOOLEAN DEFAULT TRUE,
    
    -- 保険・メンテナンス
    insurance_expiry_date DATE,
    inspection_expiry_date DATE,
    
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.6 ケアラー勤務条件（CaregiverAvailability）

```sql
CREATE TABLE caregiver_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caregiver_id UUID NOT NULL REFERENCES caregivers(id),
    
    -- 基本勤務条件
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=日曜
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    -- 希望エリア（GPS座標での範囲指定）
    preferred_area_center_lat DECIMAL(10, 8),
    preferred_area_center_lng DECIMAL(11, 8),
    preferred_area_radius_km INTEGER,
    
    -- 稼働制限
    max_daily_hours INTEGER,
    max_assignments_per_day INTEGER,
    
    -- 有効期間
    effective_from DATE,
    effective_until DATE,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.7 送迎依頼（TransportRequests）

```sql
CREATE TABLE transport_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    care_recipient_id UUID NOT NULL REFERENCES care_recipients(id),
    
    -- スケジュール情報
    request_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    appointment_time TIME NOT NULL,
    estimated_duration_minutes INTEGER,
    return_required BOOLEAN DEFAULT FALSE,
    return_pickup_time TIME,
    
    -- 場所情報
    pickup_postal_code VARCHAR(8),
    pickup_prefecture VARCHAR(10),
    pickup_city VARCHAR(50),
    pickup_address_line VARCHAR(200),
    pickup_building VARCHAR(100),
    pickup_latitude DECIMAL(10, 8),
    pickup_longitude DECIMAL(11, 8),
    
    destination_name VARCHAR(100), -- 施設名
    destination_postal_code VARCHAR(8),
    destination_prefecture VARCHAR(10),
    destination_city VARCHAR(50),
    destination_address_line VARCHAR(200),
    destination_building VARCHAR(100),
    destination_latitude DECIMAL(10, 8),
    destination_longitude DECIMAL(11, 8),
    
    -- 要件
    required_qualifications TEXT[],
    required_skills TEXT[],
    wheelchair_accessible_required BOOLEAN DEFAULT FALSE,
    medical_equipment_space_required BOOLEAN DEFAULT FALSE,
    minimum_vehicle_capacity INTEGER DEFAULT 1,
    
    -- 優先度・継続性
    priority VARCHAR(20) CHECK (priority IN ('routine', 'important', 'urgent', 'emergency')),
    continuity_preference VARCHAR(20) CHECK (continuity_preference IN ('same_caregiver', 'familiar_caregiver', 'any')),
    
    -- 特記事項
    special_instructions TEXT,
    family_contact_required BOOLEAN DEFAULT FALSE,
    
    -- ステータス管理
    status VARCHAR(20) CHECK (status IN ('pending', 'assigned', 'confirmed', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
    
    -- システム管理
    created_by UUID, -- 作成者ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);
```

### 2.8 割り当て（Assignments）

```sql
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transport_request_id UUID NOT NULL REFERENCES transport_requests(id),
    caregiver_id UUID NOT NULL REFERENCES caregivers(id),
    
    -- 割り当て詳細
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID, -- 割り当て実行者ID
    assignment_score INTEGER, -- マッチングスコア
    assignment_reason TEXT, -- 割り当て理由
    
    -- 確認状況
    caregiver_confirmed_at TIMESTAMP WITH TIME ZONE,
    caregiver_response VARCHAR(20) CHECK (caregiver_response IN ('accepted', 'declined', 'pending')),
    family_notified_at TIMESTAMP WITH TIME ZONE,
    
    -- ステータス
    status VARCHAR(20) CHECK (status IN ('assigned', 'confirmed', 'cancelled', 'completed')) DEFAULT 'assigned',
    
    -- 変更履歴
    previous_assignment_id UUID REFERENCES assignments(id),
    cancellation_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2.9 送迎実績（TransportRecords）

```sql
CREATE TABLE transport_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id),
    
    -- 実際の実行時間
    actual_pickup_time TIMESTAMP WITH TIME ZONE,
    actual_departure_time TIMESTAMP WITH TIME ZONE,
    actual_arrival_time TIMESTAMP WITH TIME ZONE,
    actual_return_pickup_time TIMESTAMP WITH TIME ZONE,
    actual_return_arrival_time TIMESTAMP WITH TIME ZONE,
    
    -- 走行情報
    total_distance_km DECIMAL(6, 2),
    total_duration_minutes INTEGER,
    
    -- 実行内容
    services_provided TEXT[],
    special_care_provided TEXT,
    
    -- 評価・フィードバック
    care_recipient_satisfaction_score INTEGER CHECK (care_recipient_satisfaction_score BETWEEN 1 AND 5),
    family_satisfaction_score INTEGER CHECK (family_satisfaction_score BETWEEN 1 AND 5),
    caregiver_notes TEXT,
    family_feedback TEXT,
    
    -- 課題・改善点
    issues_encountered TEXT,
    recommendations TEXT,
    
    -- 料金情報
    base_fee DECIMAL(10, 2),
    additional_fees DECIMAL(10, 2),
    total_fee DECIMAL(10, 2),
    
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 3. インデックス設計

### 3.1 パフォーマンス向上のためのインデックス

```sql
-- 被介護者検索
CREATE INDEX idx_care_recipients_name ON care_recipients(family_name, given_name);
CREATE INDEX idx_care_recipients_active ON care_recipients(is_active) WHERE is_active = TRUE;

-- ケアラー検索
CREATE INDEX idx_caregivers_name ON caregivers(family_name, given_name);
CREATE INDEX idx_caregivers_active ON caregivers(is_active) WHERE is_active = TRUE;

-- 送迎依頼検索
CREATE INDEX idx_transport_requests_date ON transport_requests(request_date);
CREATE INDEX idx_transport_requests_status ON transport_requests(status);
CREATE INDEX idx_transport_requests_recipient ON transport_requests(care_recipient_id);

-- 割り当て検索
CREATE INDEX idx_assignments_request ON assignments(transport_request_id);
CREATE INDEX idx_assignments_caregiver ON assignments(caregiver_id);
CREATE INDEX idx_assignments_date ON assignments(assigned_at);

-- 地理検索用インデックス
CREATE INDEX idx_pickup_location ON transport_requests USING GIST(ST_Point(pickup_longitude, pickup_latitude));
CREATE INDEX idx_destination_location ON transport_requests USING GIST(ST_Point(destination_longitude, destination_latitude));
```

## 4. 制約・関連性

### 4.1 外部キー制約
- 全ての関連テーブルは適切な外部キー制約を設定
- カスケード削除は慎重に設定（論理削除を基本とする）

### 4.2 チェック制約
- 列挙型データは CHECK 制約で値を制限
- 日付・時間の論理的整合性をチェック

### 4.3 一意制約
- 自然キー（介護保険番号、従業員番号等）には一意制約を設定

## 5. データ保持ポリシー

### 5.1 個人情報保護
- 個人情報は暗号化して保存
- アクセスログの記録
- 定期的なアクセス権限見直し

### 5.2 履歴保持
- 送迎実績：5年間保持
- 割り当て履歴：3年間保持
- システムログ：1年間保持

### 5.3 論理削除
- 重要なマスターデータは物理削除せず、`is_active` フラグで管理
- 依頼・実績データは完了後も保持

---

[← 機能仕様書](./03_functional_requirements.md) | [画面設計 →](./05_ui_design.md) 