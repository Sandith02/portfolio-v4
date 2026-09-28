begin;

create table public.contact_inquiries (
  id uuid primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(btrim(name)) between 1 and 100),
  email text not null check (char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  company text check (char_length(company) <= 160),
  topic text check (topic in ('A project', 'A collaboration', 'A role or opportunity', 'Just saying hello')),
  message text not null check (char_length(btrim(message)) between 10 and 5000),
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  client_fingerprint text check (client_fingerprint ~ '^[0-9a-f]{64}$')
);

create index contact_inquiries_email_created on public.contact_inquiries (email, created_at desc);
create index contact_inquiries_fingerprint_created on public.contact_inquiries (client_fingerprint, created_at desc) where client_fingerprint is not null;
alter table public.contact_inquiries enable row level security;
revoke all on public.contact_inquiries from public, anon, authenticated;
grant select, insert on public.contact_inquiries to service_role;

-- Callable only by the server. Rate checks and insert share one transaction.
-- Advisory locks prevent concurrent requests from bypassing either limit.
create function public.submit_contact_inquiry(
  p_id uuid, p_name text, p_email text, p_company text,
  p_topic text, p_message text, p_fingerprint text
) returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  existing public.contact_inquiries%rowtype;
begin
  perform pg_advisory_xact_lock(hashtextextended('contact-id:' || p_id::text, 0));
  select * into existing from public.contact_inquiries where id = p_id;
  if found then
    if existing.name = p_name and existing.email = p_email
       and existing.company is not distinct from p_company
       and existing.topic is not distinct from p_topic and existing.message = p_message then
      return existing.id;
    end if;
    raise exception using errcode = 'P0002', message = 'Submission ID already used';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('contact-email:' || lower(p_email), 0));
  if p_fingerprint is not null then
    perform pg_advisory_xact_lock(hashtextextended('contact-client:' || p_fingerprint, 0));
  end if;
  if (select count(*) from public.contact_inquiries where email = lower(p_email) and created_at > now() - interval '1 hour') >= 5 then
    raise exception using errcode = 'P0001', message = 'Submission limit reached';
  end if;
  if p_fingerprint is not null and (select count(*) from public.contact_inquiries where client_fingerprint = p_fingerprint and created_at > now() - interval '1 hour') >= 10 then
    raise exception using errcode = 'P0001', message = 'Submission limit reached';
  end if;

  insert into public.contact_inquiries (id, name, email, company, topic, message, client_fingerprint)
  values (p_id, p_name, lower(p_email), p_company, p_topic, p_message, p_fingerprint);
  return p_id;
end;
$$;

revoke all on function public.submit_contact_inquiry(uuid, text, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.submit_contact_inquiry(uuid, text, text, text, text, text, text) to service_role;
comment on table public.contact_inquiries is 'Private portfolio contact messages. Manage status in the Supabase Table Editor. No public read or write access.';

commit;
