-- Script simple pour ajouter les colonnes manquantes aux tables existantes
-- Exécutez ce script une fois dans Supabase SQL Editor

-- Pour la table formations
ALTER TABLE formations ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE formations ADD COLUMN IF NOT EXISTS objectif TEXT DEFAULT '';
ALTER TABLE formations ADD COLUMN IF NOT EXISTS prerequis TEXT DEFAULT '';
ALTER TABLE formations ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Pour la table dates
ALTER TABLE dates ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE dates ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Pour la table avis
ALTER TABLE avis ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE avis ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Pour la table leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Pour la table messages
ALTER TABLE messages ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Créer la table analytics si elle n'existe pas
CREATE TABLE IF NOT EXISTS analytics (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  page TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Créer les index
CREATE INDEX IF NOT EXISTS idx_formations_deleted_at ON formations(deleted_at);
CREATE INDEX IF NOT EXISTS idx_dates_deleted_at ON dates(deleted_at);
CREATE INDEX IF NOT EXISTS idx_avis_deleted_at ON avis(deleted_at);
CREATE INDEX IF NOT EXISTS idx_leads_deleted_at ON leads(deleted_at);
CREATE INDEX IF NOT EXISTS idx_messages_deleted_at ON messages(deleted_at);
CREATE INDEX IF NOT EXISTS idx_analytics_deleted_at ON analytics(deleted_at);

-- Activer RLS et créer les politiques
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE avis ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations on formations" ON formations;
DROP POLICY IF EXISTS "Allow all operations on dates" ON dates;
DROP POLICY IF EXISTS "Allow all operations on avis" ON avis;
DROP POLICY IF EXISTS "Allow all operations on leads" ON leads;
DROP POLICY IF EXISTS "Allow all operations on messages" ON messages;
DROP POLICY IF EXISTS "Allow all operations on analytics" ON analytics;

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