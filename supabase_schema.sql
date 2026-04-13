-- JipScout V3 Supabase 스키마 (SQL Editor에 붙여넣고 실행하세요)

-- 1. users 테이블 (Auth 테이블 연동)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  name text,
  avatar_url text,
  provider text,
  role text default 'user',
  created_at timestamptz default now(),
  last_login_at timestamptz
);

-- 사용자 프로필 트리거 (회원가입 시 자동 insert)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, avatar_url, provider)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    'google'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 기존 트리거가 있으면 삭제
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. loan_calculations 테이블 (대출 계산 결과 저장)
CREATE TABLE IF NOT EXISTS public.loan_calculations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  input_snapshot jsonb not null,
  result_snapshot jsonb not null,
  monthly_payment bigint,
  dsr numeric,
  ltv numeric,
  total_buying_power bigint,
  newborn_status text,
  didimdol_status text,
  bogeum_status text,
  bank_status text,
  policy_version text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. RLS(보안) 정책 설정
-- users 테이블 RLS
alter table public.users enable row level security;

create policy "Users can view their own profile"
  on public.users for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on public.users for update
  using ( auth.uid() = id );

-- loan_calculations 테이블 RLS
alter table public.loan_calculations enable row level security;

create policy "Users can view their own calculations"
  on public.loan_calculations for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own calculations"
  on public.loan_calculations for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own calculations"
  on public.loan_calculations for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own calculations"
  on public.loan_calculations for delete
  using ( auth.uid() = user_id );
