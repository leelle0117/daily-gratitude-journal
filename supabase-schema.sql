-- =============================================
-- 초기 테이블 생성 (새로 만들 경우)
-- =============================================

create table entries (
  id bigint generated always as identity primary key,
  date text not null,
  line1 text not null,
  line2 text not null,
  line3 text not null,
  user_id uuid references auth.users(id) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index entries_date_idx on entries (date desc);
create index entries_user_id_idx on entries (user_id);
alter table entries add constraint entries_user_date_key unique (user_id, date);

alter table entries enable row level security;

create policy "Users can manage own entries"
  on entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =============================================
-- 기존 DB 마이그레이션 (이미 entries 테이블이 있는 경우)
-- Supabase SQL Editor에서 순서대로 실행하세요
-- =============================================

-- 1) user_id 컬럼 추가
-- ALTER TABLE entries ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- 2) 기존 unique 제약 변경: date → (user_id, date)
-- ALTER TABLE entries DROP CONSTRAINT entries_date_key;
-- ALTER TABLE entries ADD CONSTRAINT entries_user_date_key UNIQUE (user_id, date);

-- 3) user_id 인덱스 추가
-- CREATE INDEX entries_user_id_idx ON entries (user_id);

-- 4) RLS 정책 교체
-- DROP POLICY "Allow all access" ON entries;
-- CREATE POLICY "Users can manage own entries" ON entries
--   FOR ALL USING (auth.uid() = user_id)
--   WITH CHECK (auth.uid() = user_id);

-- 5) 회원가입 후 본인 user_id로 기존 데이터 연결
-- UPDATE entries SET user_id = '여기에-본인-uuid' WHERE user_id IS NULL;

-- 6) NOT NULL 제약 추가 (5번 완료 후)
-- ALTER TABLE entries ALTER COLUMN user_id SET NOT NULL;
