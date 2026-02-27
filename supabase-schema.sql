-- Supabase SQL Editor에서 이 쿼리를 실행해주세요

create table entries (
  id bigint generated always as identity primary key,
  date text not null unique,
  line1 text not null,
  line2 text not null,
  line3 text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- date 컬럼에 인덱스 (정렬 및 조회 성능)
create index entries_date_idx on entries (date desc);

-- RLS (Row Level Security) 비활성화 (인증 없이 사용)
alter table entries enable row level security;

create policy "Allow all access"
  on entries
  for all
  using (true)
  with check (true);
