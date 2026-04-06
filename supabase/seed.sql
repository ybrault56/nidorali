insert into public.tenants (
  id,
  slug,
  app_name,
  bundle_id,
  contact_email,
  status,
  plan
) values (
  '11111111-1111-1111-1111-111111111111',
  'demo-club',
  'Club Démo',
  'com.nidorali.democlub',
  'contact@demo-club.test',
  'live',
  'starter'
)
on conflict (id) do nothing;

insert into public.tenant_configs (
  id,
  tenant_id,
  primary_color,
  secondary_color,
  font,
  splash_bg_color,
  module_members,
  module_messaging,
  module_planning,
  module_notifications,
  module_news,
  module_documents,
  module_map,
  module_forms,
  max_users
) values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  '#0F62FE',
  '#A7D8FF',
  'Inter',
  '#FFFFFF',
  true,
  true,
  true,
  true,
  true,
  true,
  false,
  true,
  500
)
on conflict (tenant_id) do nothing;

insert into public.app_users (
  id,
  tenant_id,
  email,
  display_name,
  role,
  password_hash,
  password_updated_at
) values
(
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'admin@demo-club.test',
  'Admin Demo',
  'admin',
  '$2a$10$abcdefghijklmnopqrstuv',
  now()
),
(
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  'member@demo-club.test',
  'Membre Démo',
  'member',
  '$2a$10$abcdefghijklmnopqrstuv',
  now()
)
on conflict (tenant_id, email) do nothing;

insert into public.news_posts (
  id,
  tenant_id,
  title,
  content,
  author_id,
  is_published,
  published_at
) values (
  '55555555-5555-5555-5555-555555555555',
  '11111111-1111-1111-1111-111111111111',
  'Bienvenue sur l''application',
  'Votre première actualité tenant est disponible.',
  '33333333-3333-3333-3333-333333333333',
  true,
  now()
)
on conflict (id) do nothing;

insert into public.events (
  id,
  tenant_id,
  title,
  description,
  start_at,
  end_at,
  created_by
) values (
  '66666666-6666-6666-6666-666666666666',
  '11111111-1111-1111-1111-111111111111',
  'Assemblée générale',
  'Réunion annuelle du club.',
  now() + interval '7 days',
  now() + interval '7 days 2 hours',
  '33333333-3333-3333-3333-333333333333'
)
on conflict (id) do nothing;

insert into public.forms (
  id,
  tenant_id,
  title,
  description,
  fields,
  is_active
) values (
  '77777777-7777-7777-7777-777777777777',
  '11111111-1111-1111-1111-111111111111',
  'Inscription sortie',
  'Collecte des réponses pour la prochaine sortie.',
  '[{"id":"attending","label":"Présence","type":"radio","required":true,"options":["Oui","Non"]}]'::jsonb,
  true
)
on conflict (id) do nothing;
