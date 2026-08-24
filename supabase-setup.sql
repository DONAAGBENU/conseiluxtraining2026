-- Script SQL pour configurer Supabase pour ConseiluxTraining
-- Ce script gère à la fois la création de tables et la mise à jour de tables existantes

-- Ajouter/Modifier la table formations
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'formations') THEN
        -- Ajouter les colonnes manquantes si elles n'existent pas
        ALTER TABLE formations ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
        ALTER TABLE formations ADD COLUMN IF NOT EXISTS objectif TEXT DEFAULT '';
        ALTER TABLE formations ADD COLUMN IF NOT EXISTS prerequis TEXT DEFAULT '';
        ALTER TABLE formations ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    ELSE
        -- Créer la table si elle n'existe pas
        CREATE TABLE formations (
            id TEXT PRIMARY KEY,
            titre TEXT NOT NULL,
            description TEXT NOT NULL,
            categorie TEXT NOT NULL,
            duree TEXT DEFAULT 'À définir',
            prix TEXT DEFAULT 'À définir',
            certifiante BOOLEAN DEFAULT false,
            modules JSONB DEFAULT '[]'::jsonb,
            objectif TEXT DEFAULT '',
            prerequis TEXT DEFAULT '',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            deleted_at TIMESTAMP WITH TIME ZONE
        );
    END IF;
END $$;

-- Ajouter/Modifier la table dates
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'dates') THEN
        -- Ajouter les colonnes manquantes si elles n'existent pas
        ALTER TABLE dates ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
        ALTER TABLE dates ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    ELSE
        -- Créer la table si elle n'existe pas
        CREATE TABLE dates (
            id TEXT PRIMARY KEY,
            formation_id TEXT NOT NULL,
            formation_titre TEXT NOT NULL,
            lieu TEXT NOT NULL,
            date TEXT NOT NULL,
            duree TEXT DEFAULT '5 jours',
            places INTEGER DEFAULT 15,
            disponibles INTEGER DEFAULT 15,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            deleted_at TIMESTAMP WITH TIME ZONE
        );
    END IF;
END $$;

-- Ajouter/Modifier la table avis
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'avis') THEN
        -- Ajouter les colonnes manquantes si elles n'existent pas
        ALTER TABLE avis ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
        ALTER TABLE avis ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    ELSE
        -- Créer la table si elle n'existe pas
        CREATE TABLE avis (
            id TEXT PRIMARY KEY,
            nom TEXT NOT NULL,
            role TEXT DEFAULT '',
            entreprise TEXT DEFAULT '',
            texte TEXT NOT NULL,
            note INTEGER NOT NULL CHECK (note >= 1 AND note <= 5),
            date TEXT,
            logo TEXT DEFAULT '',
            email TEXT DEFAULT '',
            telephone TEXT DEFAULT '',
            approuve BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            deleted_at TIMESTAMP WITH TIME ZONE
        );
    END IF;
END $$;

-- Ajouter/Modifier la table leads
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'leads') THEN
        -- Ajouter les colonnes manquantes si elles n'existent pas
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    ELSE
        -- Créer la table si elle n'existe pas
        CREATE TABLE leads (
            id TEXT PRIMARY KEY,
            nom TEXT NOT NULL,
            email TEXT NOT NULL,
            telephone TEXT NOT NULL,
            entreprise TEXT DEFAULT '',
            source TEXT DEFAULT 'catalogue',
            date TEXT NOT NULL,
            pays TEXT DEFAULT '',
            ville TEXT DEFAULT '',
            formation_titre TEXT DEFAULT '',
            message TEXT DEFAULT '',
            contact_preference TEXT DEFAULT 'email',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            deleted_at TIMESTAMP WITH TIME ZONE
        );
    END IF;
END $$;

-- Ajouter/Modifier la table messages
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'messages') THEN
        -- Ajouter les colonnes manquantes si elles n'existent pas
        ALTER TABLE messages ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
        ALTER TABLE messages ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    ELSE
        -- Créer la table si elle n'existe pas
        CREATE TABLE messages (
            id TEXT PRIMARY KEY,
            nom TEXT NOT NULL,
            email TEXT NOT NULL,
            telephone TEXT DEFAULT '',
            sujet TEXT DEFAULT 'Autre',
            message TEXT NOT NULL,
            date TEXT NOT NULL,
            lu BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            deleted_at TIMESTAMP WITH TIME ZONE
        );
    END IF;
END $$;

-- Ajouter/Modifier la table analytics
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'analytics') THEN
        -- Ajouter les colonnes manquantes si elles n'existent pas
        ALTER TABLE analytics ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
        ALTER TABLE analytics ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    ELSE
        -- Créer la table si elle n'existe pas
        CREATE TABLE analytics (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            page TEXT,
            metadata JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            deleted_at TIMESTAMP WITH TIME ZONE
        );
    END IF;
END $$;

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_formations_deleted_at ON formations(deleted_at);
CREATE INDEX IF NOT EXISTS idx_dates_deleted_at ON dates(deleted_at);
CREATE INDEX IF NOT EXISTS idx_avis_deleted_at ON avis(deleted_at);
CREATE INDEX IF NOT EXISTS idx_leads_deleted_at ON leads(deleted_at);
CREATE INDEX IF NOT EXISTS idx_messages_deleted_at ON messages(deleted_at);
CREATE INDEX IF NOT EXISTS idx_analytics_deleted_at ON analytics(deleted_at);

-- Activer Row Level Security (RLS)
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE avis ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Allow all operations on formations" ON formations;
DROP POLICY IF EXISTS "Allow all operations on dates" ON dates;
DROP POLICY IF EXISTS "Allow all operations on avis" ON avis;
DROP POLICY IF EXISTS "Allow all operations on leads" ON leads;
DROP POLICY IF EXISTS "Allow all operations on messages" ON messages;
DROP POLICY IF EXISTS "Allow all operations on analytics" ON analytics;

-- Créer des politiques RLS pour permettre les opérations nécessaires
CREATE POLICY "Allow all operations on formations" ON formations
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on dates" ON dates
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on avis" ON avis
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on leads" ON leads
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on messages" ON messages
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on analytics" ON analytics
  FOR ALL USING (true)
  WITH CHECK (true);