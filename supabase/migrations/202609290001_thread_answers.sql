begin;

create table public.thread_answers (
  id uuid primary key,
  created_at timestamptz not null default now(),
  thread_slug text not null check (char_length(thread_slug) between 1 and 160),
  thread_title text not null,
  question text not null,
  answer text not null check (char_length(btrim(answer)) between 1 and 20000),
  word_count integer generated always as (cardinality(regexp_split_to_array(btrim(answer), '\s+'))) stored,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  client_fingerprint text not null check (client_fingerprint ~ '^[0-9a-f]{64}$'),
  check (word_count between 1 and 500)
);
create index thread_answers_thread_created on public.thread_answers (thread_slug, created_at desc);
create index thread_answers_client_created on public.thread_answers (client_fingerprint, created_at desc);
alter table public.thread_answers enable row level security;
revoke all on public.thread_answers from public, anon, authenticated;
grant select, insert on public.thread_answers to service_role;

create function public.submit_thread_answer(
  p_id uuid, p_slug text, p_title text, p_question text, p_answer text, p_fingerprint text
) returns uuid
language plpgsql security invoker set search_path = ''
as $$
declare existing public.thread_answers%rowtype;
begin
  perform pg_advisory_xact_lock(hashtextextended('thread-answer-id:' || p_id::text, 0));
  select * into existing from public.thread_answers where id = p_id;
  if found then
    if existing.thread_slug = p_slug and existing.answer = p_answer and existing.client_fingerprint = p_fingerprint then
      return existing.id;
    end if;
    raise exception using errcode = 'P0002', message = 'Submission ID already used';
  end if;
  perform pg_advisory_xact_lock(hashtextextended('thread-answer-client:' || p_fingerprint, 0));
  if (select count(*) from public.thread_answers where client_fingerprint = p_fingerprint and created_at > now() - interval '1 hour') >= 10 then
    raise exception using errcode = 'P0001', message = 'Submission limit reached';
  end if;
  insert into public.thread_answers (id, thread_slug, thread_title, question, answer, client_fingerprint)
    values (p_id, p_slug, p_title, p_question, p_answer, p_fingerprint);
  return p_id;
end;
$$;
revoke all on function public.submit_thread_answer(uuid, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.submit_thread_answer(uuid, text, text, text, text, text) to service_role;
comment on table public.thread_answers is 'Private reader answers to Threads. Read and manage status in the Supabase Table Editor. No public access.';
commit;
