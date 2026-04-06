# Nidorali — Plateforme SaaS White-Label Mobile

## Table des matières
1. Vue d'ensemble
2. Architecture technique
3. Prérequis
4. Installation locale (step-by-step)
5. Variables d'environnement (toutes documentées)
6. Structure du monorepo
7. Guide des modules
8. API Reference (toutes les routes)
9. Schéma de base de données
10. Pipeline de build automatisé
11. Déploiement en production
12. Guide d'ajout d'un nouveau module
13. Troubleshooting
14. Contribution

## Vue d'ensemble
Nidorali est un monorepo `pnpm` destiné à produire des applications mobiles white-label à partir d’un codebase mutualisé. Le flux principal est le suivant :

1. Un client configure sa future app dans `apps/dashboard`.
2. Le dashboard envoie la configuration au backend `apps/api`.
3. Stripe valide l’abonnement mensuel.
4. L’API crée le tenant et déclenche `apps/build-service`.
5. `apps/mobile` est compilée avec le slug tenant, les assets et les identifiants de bundle du client.

Ce dépôt contient déjà :
- le dashboard Next.js pour le wizard et le back-office Nidorali,
- l’API Fastify multi-tenant,
- l’application Expo Router avec thème tenant dynamique,
- le build-service BullMQ/Sharp/EAS/Resend,
- les types partagés, la logique de pricing et les migrations Supabase.

## Architecture technique
- `apps/dashboard`
  Frontend Next.js 14 App Router. Il contient le wizard `/configure`, les pages d’auth admin Supabase et le back-office Nidorali.
- `apps/api`
  Backend Fastify modulaire. Les routes sont regroupées par domaine métier, la validation est faite avec Zod et toutes les réponses suivent le format `{ success, data|error }`.
- `apps/mobile`
  App Expo Router / NativeWind. Le tenant est résolu au démarrage avec `EXPO_PUBLIC_TENANT_SLUG`, puis le thème, les tabs et les écrans sont adaptés à la configuration tenant.
- `apps/build-service`
  API interne et worker BullMQ. Le service prépare les assets, génère un manifest de build tenant-aware, lance EAS et envoie les emails transactionnels.
- `packages/types`
  Contrats TypeScript partagés, enums métier et logique de pricing.
- `packages/ui`
  Primitives React partagées pour le dashboard.
- `packages/config`
  Helpers de validation d’environnement et presets `tsconfig` / ESLint.
- `supabase`
  Migrations SQL versionnées et `seed.sql`.

## Prérequis
- Node.js 20+.
- `pnpm` 10+.
- Un projet Supabase.
- Un compte Stripe avec webhook configuré.
- Redis pour BullMQ.
- EAS CLI utilisable depuis l’environnement du build-service.
- Un compte Resend pour les emails transactionnels.

## Installation locale (step-by-step)
1. Installer les dépendances :

```bash
pnpm install
```

2. Pour une simulation locale sans Supabase/Stripe/Redis/EAS réels, générer directement les fichiers d'environnement :

```powershell
pnpm simulation:setup
```

Le script crée :
- `apps/api/.env`
- `apps/dashboard/.env.local`
- `apps/mobile/.env`
- `apps/build-service/.env`

3. Si vous voulez brancher les services réels, vous pouvez à la place copier le template racine :

```bash
cp .env.example .env
```

Sous Windows PowerShell :

```powershell
Copy-Item .env.example .env
```

4. Renseigner les variables d’environnement demandées pour :
- `apps/api`
- `apps/dashboard`
- `apps/mobile`
- `apps/build-service`

5. En mode réel, appliquer la base Supabase :

```bash
supabase db reset
```

Ou, si vous gérez les migrations manuellement :
- exécuter `supabase/migrations/202603200001_init_nidorali.sql`,
- exécuter `supabase/seed.sql`.

6. Démarrer la simulation locale web :

```bash
pnpm dev:simulation
```

7. Démarrer le mobile dans un terminal séparé :

```bash
pnpm simulation:mobile
```

8. Lancer le smoke test HTTP de bout en bout quand l'API et le build-service sont prêts :

```powershell
pnpm simulation:smoke
```

9. Exécuter les gates qualité :

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

### Parcours de test local recommandé
1. Ouvrir [http://localhost:3000/configure](http://localhost:3000/configure) pour tester le wizard.
2. Créer une configuration complète jusqu'à l'étape paiement.
3. Valider le faux checkout : le mode simulation redirige directement vers `/success`.
4. Ouvrir [http://localhost:3000/admin/tenants](http://localhost:3000/admin/tenants) pour vérifier la création du tenant et l'évolution du build.
5. Ouvrir [http://localhost:3000/admin/builds](http://localhost:3000/admin/builds) pour suivre les statuts `processing -> building -> submitting -> done`.
6. Ouvrir l'app Expo avec `EXPO_PUBLIC_TENANT_SLUG=demo-club`, créer un compte utilisateur final, puis tester `members`, `news`, `planning`, `documents` et `forms`.
7. Pour tester un tenant fraîchement généré sur mobile, remplacer `EXPO_PUBLIC_TENANT_SLUG` dans `apps/mobile/.env`, puis relancer Expo.

## Variables d'environnement (toutes documentées)
### `apps/api`
- `SUPABASE_URL`
  URL du projet Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`
  Clé service role utilisée par l’API pour lire/écrire sur le schéma multi-tenant.
- `STRIPE_SECRET_KEY`
  Clé secrète Stripe pour créer les sessions Checkout et vérifier les événements.
- `STRIPE_WEBHOOK_SECRET`
  Secret du webhook Stripe.
- `JWT_SECRET`
  Secret de signature des JWT mobile.
- `JWT_EXPIRES_IN`
  Durée de vie des JWT mobile. Par défaut `7d`.
- `BUILD_SERVICE_URL`
  URL interne du build-service.
- `BUILD_SERVICE_SECRET`
  Secret partagé entre l’API et le build-service.
- `NIDORALI_SIMULATION_MODE`
  Active le dépôt mémoire, l’auth admin locale et le checkout simulé. Utiliser `true` pour les tests locaux de bout en bout.
- `NIDORALI_ADMIN_BEARER_TOKEN`
  Jeton admin local utilisé par le dashboard et les scripts de smoke test quand la simulation est active.
- `RESEND_API_KEY`
  Clé Resend disponible pour les workflows transactionnels.
- `PORT`
  Port HTTP de l’API.
- `LOG_LEVEL`
  Niveau Pino.
- `ALLOWED_ORIGINS`
  Liste d’origines autorisées, séparées par des virgules.

### `apps/dashboard`
- `NEXT_PUBLIC_SUPABASE_URL`
  URL publique Supabase pour l’auth admin.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  Clé publique Supabase.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  Clé Stripe publique pour Checkout.
- `NEXT_PUBLIC_API_URL`
  URL publique de l’API.
- `NEXT_PUBLIC_NIDORALI_SIMULATION_MODE`
  Active le back-office local sans session Supabase réelle.
- `NEXT_PUBLIC_NIDORALI_ADMIN_BEARER_TOKEN`
  Jeton admin local injecté côté dashboard pour appeler les routes `/api/admin/*`.
- `DASHBOARD_SUPABASE_STORAGE_BUCKET`
  Bucket Supabase Storage pour les logos. La base de code utilise `tenant-assets` par défaut.

### `apps/mobile`
- `EXPO_PUBLIC_API_URL`
  URL publique de l’API.
- `EXPO_PUBLIC_TENANT_SLUG`
  Slug injecté au build par tenant. C’est la clé de bootstrap de l’application mobile.

### `apps/build-service`
- `SUPABASE_URL`
  URL Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`
  Clé service role pour mettre à jour `tenants` et `build_jobs`.
- `REDIS_URL`
  Connexion BullMQ.
- `EAS_TOKEN`
  Token EAS.
- `RESEND_API_KEY`
  Clé Resend.
- `EXPO_PROJECT_ID`
  Identifiant du projet Expo.
- `MOBILE_APP_PATH`
  Chemin relatif vers `apps/mobile`.
- `BUILD_SERVICE_SECRET`
  Secret d’authentification interne.
- `BUILD_SERVICE_SIMULATION_MODE`
  Active un pipeline local sans Redis, Supabase, Resend ni EAS réels.
- `NIDORALI_API_URL`
  URL de callback de l’API, utilisée par le build-service simulé pour faire progresser les `build_jobs`.
- `SIMULATION_BUILD_DELAY_MS`
  Durée entre deux étapes du pipeline simulé.
- `PORT`
  Port HTTP du build-service.

## Structure du monorepo
```text
nidorali/
├── apps/
│   ├── api/
│   ├── build-service/
│   ├── dashboard/
│   └── mobile/
├── packages/
│   ├── config/
│   ├── types/
│   └── ui/
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── .env.example
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

## Guide des modules
Modules livrés dans le MVP :
- `module_members`
  Profils, annuaire et espace membre.
- `module_notifications`
  Enregistrement des tokens Expo et envoi de push.
- `module_messaging`
  Conversations et messages.
- `module_planning`
  Événements et réponses de présence.
- `module_news`
  Fil d’actualités.
- `module_documents`
  Bibliothèque documentaire.
- `module_forms`
  Formulaires configurables.
- `module_map`
  Capacité UI côté mobile, aujourd’hui exposée dans l’écran `More`.

Le dashboard utilise `packages/types/src/constants.ts` comme source unique pour les labels et la tarification. Le mobile lit les mêmes flags depuis `TenantConfig`.

## API Reference (toutes les routes)
Toutes les réponses utilisent :

```json
{ "success": true, "data": {} }
```

ou :

```json
{ "success": false, "error": { "code": "string", "message": "string", "details": {} } }
```

### Public
- `GET /health`
- `GET /api/config?tenant=:slug`
- `POST /api/billing/checkout-session`
- `POST /api/webhooks/stripe`

### Auth mobile
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/push-token`

### Membres
- `GET /api/members`
- `GET /api/members/me`
- `PATCH /api/members/me`

### Messagerie
- `GET /api/conversations`
- `POST /api/conversations`
- `GET /api/conversations/:id/messages`
- `POST /api/conversations/:id/messages`

### Planning
- `GET /api/events`
- `POST /api/events`
- `GET /api/events/:id`
- `PATCH /api/events/:id`
- `DELETE /api/events/:id`
- `POST /api/events/:id/attend`

### Notifications
- `POST /api/notifications/send`

### Actualités
- `GET /api/news`
- `POST /api/news`
- `GET /api/news/:id`
- `PATCH /api/news/:id`
- `DELETE /api/news/:id`

### Documents
- `GET /api/documents`
- `POST /api/documents`
- `DELETE /api/documents/:id`

### Formulaires
- `GET /api/forms`
- `GET /api/forms/:id`
- `POST /api/forms/:id/respond`

### Back-office Nidorali
- `GET /api/admin/tenants`
- `GET /api/admin/tenants/:id`
- `POST /api/admin/tenants/:id/trigger-build`
- `GET /api/admin/builds`
- `POST /api/admin/uploads/logo`

## Schéma de base de données
Le schéma initial est défini dans `supabase/migrations/202603200001_init_nidorali.sql`.

Tables principales :
- `tenants`
  Métadonnées client, statut métier, plan, références Stripe.
- `tenant_configs`
  Branding, modules activés, quotas.
- `app_users`
  Utilisateurs finaux de l’app tenantée.
- `conversations`, `conversation_members`, `messages`
  Module messagerie.
- `events`, `event_attendees`
  Module planning.
- `news_posts`
  Module actualités.
- `push_notifications`
  Historique des push.
- `documents`
  Métadonnées documentaires.
- `forms`, `form_responses`
  Formulaires configurables et réponses.
- `build_jobs`
  Historique technique des builds EAS et des artefacts/store URLs.

RLS :
- toutes les tables tenantées activent la Row-Level Security,
- la fonction `public.current_tenant_id()` lit `app.current_tenant_id`,
- les policies filtrent toutes les lectures/écritures par `tenant_id`.

## Pipeline de build automatisé
1. Stripe confirme le paiement via `POST /api/webhooks/stripe`.
2. L’API crée `tenants`, `tenant_configs` et un `build_job`.
3. L’API pousse la demande dans `apps/build-service` via `POST /internal/builds`.
4. BullMQ enfile un job `tenant-build`.
5. Le worker :
   - charge le tenant depuis Supabase,
   - génère les assets avec Sharp,
   - écrit un manifest de build tenant-aware,
   - lance EAS pour Android et iOS,
   - met à jour `build_jobs`,
   - passe le tenant à `live`,
   - envoie les emails transactionnels via Resend.

Le manifest généré est écrit dans :

```text
apps/mobile/.generated/<tenant-slug>/build-manifest.json
```

En mode simulation locale :
- le checkout crée directement le tenant côté API,
- le build-service rejoue un cycle `processing -> building -> submitting -> done`,
- l’API met à jour le tenant et les `build_jobs` via une route interne sécurisée,
- aucun service externe n’est requis pour valider le parcours.

## Déploiement en production
### API
- déployer `apps/api` sur une cible Node 20+,
- fournir toutes les variables d’environnement,
- exposer `/api/webhooks/stripe` publiquement,
- sécuriser `ALLOWED_ORIGINS`.

### Dashboard
- déployer `apps/dashboard` sur une cible Next.js compatible Node,
- connecter Supabase Auth côté admin,
- configurer la clé Stripe publique et l’URL API publique.

### Mobile
- configurer EAS avec le projet Expo,
- fournir `EXPO_PUBLIC_API_URL`,
- injecter `EXPO_PUBLIC_TENANT_SLUG` pendant chaque build tenant,
- gérer les credentials App Store / Play Store hors repo.

### Build-service
- déployer `apps/build-service` sur un runtime Node 20+,
- brancher Redis,
- fournir le secret interne partagé avec l’API,
- garantir que l’environnement peut exécuter EAS CLI et Sharp.

## Guide d'ajout d'un nouveau module
Exemple : `module_shop`.

1. Ajouter la colonne SQL dans `tenant_configs`.
   Exemple : `module_shop boolean not null default false`.
2. Mettre à jour la migration de référence ou créer une migration incrémentale dans `supabase/migrations/`.
3. Ajouter le flag dans `packages/types/src/types.ts`.
4. Ajouter le label dans `packages/types/src/constants.ts`.
5. Ajouter le prix dans `packages/types/src/pricing.ts`.
6. Créer le module API dans `apps/api/src/modules/shop/`.
   Minimum attendu :
   - `routes.ts`
   - `service.ts`
   - `schema.ts` si le module accepte des payloads
7. Enregistrer le module dans `apps/api/src/app.ts`.
8. Ajouter les écrans mobiles dans `apps/mobile/app/(tabs)/shop/` ou dans `more` selon la navigation voulue.
9. Mettre à jour `apps/mobile/app/(tabs)/tabs.config.ts` si le module doit exposer un onglet.
10. Ajouter les composants dédiés dans `apps/mobile/components/modules/shop/`.
11. Ajouter la bascule dans le configurateur :
   - `apps/dashboard/components/wizard/ModulesStep.tsx`
   - éventuellement `apps/dashboard/lib/validations.ts`
12. Mettre à jour la preview mobile live dans `apps/dashboard/components/wizard/MobilePreview.tsx`.
13. Ajouter au moins :
   - un test API,
   - un test dashboard si le pricing change,
   - un test mobile si la navigation change.
14. Documenter le nouveau module dans ce README.

## Troubleshooting
### `pnpm build` échoue sur Expo
- vérifier `EXPO_PUBLIC_API_URL` et `EXPO_PUBLIC_TENANT_SLUG`,
- vérifier les versions Expo / React Native / Expo Router,
- lancer `pnpm --filter @nidorali/mobile dev` pour reproduire localement.

### Le webhook Stripe échoue
- vérifier `STRIPE_WEBHOOK_SECRET`,
- vérifier que l’URL publique pointe bien vers `POST /api/webhooks/stripe`,
- s’assurer que le body reçu par l’API est compatible avec la vérification de signature.

### Les builds ne partent pas
- vérifier `BUILD_SERVICE_URL` et `BUILD_SERVICE_SECRET`,
- vérifier que Redis est accessible,
- vérifier que le worker BullMQ tourne.

### La simulation locale ne progresse pas
- vérifier que `pnpm dev:simulation` lance bien `apps/api`, `apps/dashboard` et `apps/build-service`,
- vérifier que `apps/api/.env` contient `NIDORALI_SIMULATION_MODE=true`,
- vérifier que `apps/build-service/.env` contient `BUILD_SERVICE_SIMULATION_MODE=true` et `NIDORALI_API_URL=http://localhost:3001`,
- exécuter `pnpm simulation:smoke` pour identifier l’étape en erreur.

### Les emails ne partent pas
- vérifier `RESEND_API_KEY`,
- vérifier l’adresse `from`,
- consulter les logs du build-service.

### Les données cross-tenant remontent
- vérifier la policy RLS concernée,
- vérifier le filtrage explicite par `tenant_id` dans l’API,
- vérifier la valeur injectée dans `X-Tenant-ID`.

## Contribution
- utiliser des changements reviewables et ciblés,
- garder `pnpm lint`, `pnpm typecheck`, `pnpm test` et `pnpm build` verts,
- documenter toute nouvelle variable d’environnement,
- documenter tout nouveau module dans le README,
- ne jamais introduire de secrets en clair dans le dépôt.
