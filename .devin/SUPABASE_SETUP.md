# Configuration Supabase pour Conseilux Training

Ce guide vous explique comment configurer Supabase pour que votre site fonctionne correctement avec la base de données en ligne.

## Étape 1: Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Cliquez sur "New Project"
4. Remplissez les informations:
   - **Name**: conseilux-training
   - **Database Password**: Choisissez un mot de passe fort (notez-le!)
   - **Region**: Choisissez la région la plus proche de vos utilisateurs
5. Attendez que le projet soit créé (environ 2 minutes)

## Étape 2: Configurer les variables d'environnement

Une fois votre projet créé:

1. Allez dans **Settings** > **API**
2. Copiez les valeurs suivantes:
   - **Project URL** (ex: https://xxxxxxxx.supabase.co)
   - **anon public** key (la clé publique)

3. Créez un fichier `.env.local` à la racine du projet avec le contenu suivant:

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
ADMIN_EMAIL=contact@conseiluxtraining.com
ADMIN_PASSWORD=votre_mot_de_passe_admin
```

**Remplacez les valeurs par celles de votre projet Supabase.**

## Étape 3: Créer les tables dans la base de données

Allez dans **SQL Editor** dans Supabase et exécutez les commandes suivantes:

### Table formations
```sql
CREATE TABLE formations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  categorie TEXT NOT NULL,
  duree TEXT,
  prix TEXT,
  certifiante BOOLEAN DEFAULT FALSE,
  modules TEXT[],
  objectif TEXT,
  prerequis TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Index pour optimiser les recherches
CREATE INDEX idx_formations_deleted_at ON formations(deleted_at);
CREATE INDEX idx_formations_categorie ON formations(categorie);
```

### Table dates
```sql
CREATE TABLE dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  formation_id TEXT,
  formation_titre TEXT NOT NULL,
  date_debut DATE NOT NULL,
  date_fin DATE,
  lieu TEXT,
  places_disponibles INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_dates_deleted_at ON dates(deleted_at);
CREATE INDEX idx_dates_formation_id ON dates(formation_id);
```

### Table avis
```sql
CREATE TABLE avis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  formation_titre TEXT NOT NULL,
  note INTEGER CHECK (note >= 1 AND note <= 5),
  commentaire TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_avis_deleted_at ON avis(deleted_at);
```

### Table leads
```sql
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  entreprise TEXT,
  pays TEXT,
  ville TEXT,
  message TEXT,
  source TEXT DEFAULT 'catalogue',
  formation_titre TEXT,
  contact_preference TEXT DEFAULT 'email',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_leads_deleted_at ON leads(deleted_at);
CREATE INDEX idx_leads_source ON leads(source);
```

### Table messages
```sql
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  sujet TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_messages_deleted_at ON messages(deleted_at);
```

## Étape 4: Configurer le Storage pour les images

1. Allez dans **Storage** dans Supabase
2. Cliquez sur "New bucket"
3. Nommez le bucket: `formations-images`
4. Cochez "Public bucket"
5. Configurez les politiques (policies):

### Politique de lecture (public)
```sql
-- Permettre à tout le monde de voir les images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'formations-images' );
```

### Politique d'upload (authentifié)
```sql
-- Permettre aux utilisateurs authentifiés d'uploader
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'formations-images' );
```

## Étape 5: Configurer Row Level Security (RLS)

Activez RLS sur toutes les tables:

```sql
-- Formations
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Formations" ON formations FOR SELECT TO public USING (deleted_at IS NULL);
CREATE POLICY "Admin Manage Formations" ON formations FOR ALL TO authenticated USING (true);

-- Dates
ALTER TABLE dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Dates" ON dates FOR SELECT TO public USING (deleted_at IS NULL);
CREATE POLICY "Admin Manage Dates" ON dates FOR ALL TO authenticated USING (true);

-- Avis
ALTER TABLE avis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Avis" ON avis FOR SELECT TO public USING (deleted_at IS NULL);
CREATE POLICY "Admin Manage Avis" ON avis FOR ALL TO authenticated USING (true);

-- Leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Leads" ON leads FOR SELECT TO public USING (deleted_at IS NULL);
CREATE POLICY "Admin Manage Leads" ON leads FOR ALL TO authenticated USING (true);

-- Messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Messages" ON messages FOR SELECT TO public USING (deleted_at IS NULL);
CREATE POLICY "Admin Manage Messages" ON messages FOR ALL TO authenticated USING (true);
```

## Étape 6: Tester la configuration

1. Redémarrez votre serveur de développement:
   ```bash
   npm run dev
   ```

2. Accédez à `http://localhost:3000/admin`

3. Connectez-vous avec les identifiants configurés dans `.env.local`

4. Testez l'ajout d'une formation avec une image (URL ou upload)

## Problèmes courants

### "Supabase client not available"
- Vérifiez que votre fichier `.env.local` existe et contient les bonnes valeurs
- Redémarrez le serveur après avoir modifié les variables d'environnement

### Erreur d'upload d'image
- Vérifiez que le bucket `formations-images` existe et est public
- Vérifiez les politiques de storage

### Timeout sur le dashboard
- Vérifiez votre connexion internet
- Vérifiez que les tables existent dans Supabase

## Support

Pour plus d'informations, consultez la documentation Supabase: [https://supabase.com/docs](https://supabase.com/docs)
