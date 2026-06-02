-- Optional PDF path for label applications (max 5 MB, uploaded via app action)
alter table public.green_label_applications
  add column if not exists document_path text;

comment on column public.green_label_applications.document_path is
  'Supabase storage path in green-label-documents bucket (application/pdf, optional)';

-- insert into storage.buckets (id, name, public) values ('green-label-documents', 'green-label-documents', false) on conflict do nothing;
