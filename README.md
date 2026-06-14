# PostePro — Landing & capture (Phase 1)

> **Votre contenu local de la semaine, rédigé et prêt à publier en 30 secondes.**

Micro-SaaS en libre-service qui génère chaque semaine un pack de contenu local
pour les professionnels indépendants en France (niche de lancement :
**dentistes**). Ce dépôt contient **la Phase 1 uniquement** : landing page,
capture d'e-mails (waitlist) et pages SEO programmatiques, conçues pour valider
la demande avant de coder le produit complet.

---

## 1. Stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS 3.4**
- Rendu **SSG** pour les pages SEO programmatiques (`generateStaticParams`),
  ISR-ready
- Aucune dépendance UI lourde (perf / Lighthouse ≥ 95)
- Capture d'e-mails via une **API route** + interface `saveLead()` abstraite

## 2. Installation locale

```bash
# 1. Dépendances
npm install

# 2. Variables d'environnement
cp .env.example .env.local
# puis éditez .env.local (au minimum NEXT_PUBLIC_SITE_URL)

# 3. Développement
npm run dev          # http://localhost:3000

# 4. Build de production
npm run build && npm start
```

En développement sans Supabase, les leads sont écrits dans
`./data/leads.ndjson` (ignoré par git). Pratique pour relire les inscriptions.

## 3. Arborescence

```
app/
  layout.tsx                     Shell + métadonnées + Header/Footer + JSON-LD global
  page.tsx                       Landing one-page (compose les sections)
  opengraph-image.tsx            Image Open Graph dynamique (next/og)
  robots.ts / sitemap.ts         SEO technique
  merci/                         Écran de remerciement (noindex)
  confidentialite/               Politique de confidentialité (RGPD)
  mentions-legales/              Mentions légales
  idees-de-posts/[metier]/[ville]/   Pages SEO programmatiques (SSG)
  api/lead/route.ts              Endpoint de capture d'e-mails
components/
  sections/                      Hero, Problem, Solution, PackPreview, Reassurance, Pricing, Faq, FinalCta
  ui/                            Container, Section, Button
  LeadForm.tsx                   Formulaire de capture (client)
  Header.tsx / Footer.tsx / JsonLd.tsx
lib/
  config.ts                      Config marque / URL / prix
  jsonld.ts                      Helpers données structurées (Org, Service, Article, FAQ, Breadcrumb)
  faq.ts                         FAQ partagée (section + JSON-LD)
  leads/                         saveLead() + providers (fichier / Supabase)
  seo/content.ts                 Génération du contenu unique des pages SEO
  generation/index.ts            Interface generatePack() — STUB Phase 2
data/
  metiers.json                   5 métiers (dentiste, kiné, coiffeur, plombier, avocat)
  villes.json                    4 villes (Paris, Lyon, Marseille, Toulouse)
```

## 4. Pages SEO programmatiques

- Modèle d'URL : `/idees-de-posts/[metier]/[ville]`
- **20 pages d'exemple** (5 métiers × 4 villes) générées au build.
- Contenu **unique** par page : intro localisée (ville, région, quartier) +
  liste d'idées pivotée et interpolée différemment par couple métier × ville.
- **Scalabilité** : ajoutez des entrées dans `data/metiers.json` /
  `data/villes.json` → de nouvelles pages apparaissent automatiquement (sitemap
  inclus). Pour des centaines de pages, passez en ISR :

  ```ts
  // dans app/idees-de-posts/[metier]/[ville]/page.tsx
  export const dynamicParams = true;
  export const revalidate = 86400; // régénère à la demande, sans tout rebuild
  ```

## 5. Capture d'e-mails — `saveLead()`

Tout passe par `lib/leads/index.ts → saveLead(lead)`. Le provider est choisi par
variable d'environnement, **sans changement de code** :

| Condition                                            | Provider utilisé        |
| ---------------------------------------------------- | ----------------------- |
| `SUPABASE_URL` **et** `SUPABASE_SERVICE_ROLE_KEY` définis | Supabase (REST, sans SDK) |
| sinon                                                | Fichier NDJSON (dev / fallback) |

> ⚠️ En production sur Vercel, le système de fichiers est **éphémère**.
> Configurez **Supabase** (table `leads`, voir `.env.example`) pour persister.
> Pour brancher Airtable / Brevo / Resend : créez un module exportant un
> `LeadProvider` (`lib/leads/types.ts`) et ajoutez-le au sélecteur.

## 6. SEO & conformité

- `<title>` / meta descriptions dynamiques, Open Graph, Twitter Card
- Données structurées JSON-LD : `Organization`, `WebSite`, `Service`,
  `FAQPage`, `Article`, `BreadcrumbList`
- `sitemap.xml` + `robots.txt` générés (incluent les pages programmatiques)
- Balises canoniques sur toutes les pages
- **RGPD** : consentement explicite, politique de confidentialité, aucun
  traceur tiers, honeypot anti-spam
- **A11y** : labels de formulaire, focus visible, contrastes AA, navigation clavier

## 7. Points d'extension — Phase 2 (NON codée ici)

L'architecture est prête à accueillir le produit complet sans refonte :

1. **Auth & onboarding** — réutiliser les champs métier / ville / prestations
   déjà présents dans `LeadForm` et `data/`. Ajouter un dossier `app/(app)/` pour
   l'espace connecté.
2. **Moteur de génération** — implémenter l'interface `PackGenerator.generatePack(profile)`
   déjà définie dans `lib/generation/index.ts` (cible : modèle Claude le plus
   récent, prompts par métier). Retourne `ContentPack` (3 GBP + 1 article + 3 réseaux).
3. **Dashboard** — afficher les `ContentPack` générés ; bouton copier-coller.
4. **Stripe** — passer du gratuit (1er pack) à 39 €/mois. Brancher au moment où
   l'utilisateur réclame son 2ᵉ pack. Webhooks dans `app/api/stripe/`.
5. **E-mail transactionnel** — enrichir `saveLead()` pour déclencher un e-mail de
   bienvenue (Resend/Brevo) à l'inscription.

## 8. Déploiement (Vercel)

1. Poussez le dépôt sur GitHub/GitLab.
2. Sur [vercel.com](https://vercel.com) : **New Project** → importez le dépôt.
   Le preset **Next.js** est détecté automatiquement.
3. **Environment Variables** : ajoutez `NEXT_PUBLIC_SITE_URL` (votre domaine
   final, ex. `https://postepro.fr`) et, pour persister les leads,
   `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.
4. **Deploy**. Branchez ensuite votre domaine dans *Settings → Domains*.
5. Vérifiez `/(`accueil), `/sitemap.xml`, `/robots.txt`, une page SEO
   (`/idees-de-posts/dentiste/lyon`) et la soumission du formulaire.
6. Soumettez `sitemap.xml` dans **Google Search Console**.

## 9. Plan de validation (go / no-go Phase 2)

Objectif : décider de construire le produit complet sur des **données réelles**,
pas sur une intuition.

**Métriques à suivre**

| Métrique | Outil | Seuil indicatif « go » |
| --- | --- | --- |
| Taux de conversion e-mail (landing) | leads ÷ visiteurs | **≥ 5 %** (≥ 8 % si trafic ciblé) |
| Taux de conversion pages SEO | leads ÷ visiteurs SEO | **≥ 2–3 %** |
| Volume de leads qualifiés | table `leads` (filtrer par métier/ville) | **≥ 50–100** sur 4–6 semaines |
| Pages SEO indexées | Google Search Console | **≥ 70 %** des pages publiées |
| Impressions / clics SEO | Search Console | tendance croissante sur 4 semaines |
| Concentration de la demande | leads groupés par ville/métier | une niche claire se détache |

**Méthode**

1. Lancer une petite acquisition (Google Ads local « dentiste + ville »,
   posts ciblés) vers la landing **et** vers 2–3 pages SEO.
2. Laisser tourner 4 à 6 semaines.
3. **Go Phase 2** si : conversion e-mail ≥ 5 %, ≥ 50 leads qualifiés, et au
   moins un couple métier × ville qui ressort nettement → on code `generatePack`
   pour cette niche d'abord.
4. **No-go / pivot** si conversion < 2 % malgré du trafic qualifié : retravailler
   la promesse, le métier cible ou le prix avant d'investir dans le produit.

---

© PostePro — En cours de lancement. Code Phase 1 prêt à déployer.
