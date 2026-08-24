-- Exécutez ce script SQL dans votre projet Supabase pour créer les tables nécessaires

-- Table formations
CREATE TABLE IF NOT EXISTS formations (
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

-- Table dates
CREATE TABLE IF NOT EXISTS dates (
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

-- Table avis
CREATE TABLE IF NOT EXISTS avis (
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

-- Table leads
CREATE TABLE IF NOT EXISTS leads (
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

-- Table messages
CREATE TABLE IF NOT EXISTS messages (
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

-- Table analytics
CREATE TABLE IF NOT EXISTS analytics (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  page TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

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

-- Créer des politiques RLS pour permettre les opérations nécessaires
-- Note: Pour la production, vous devrez créer des politiques plus sécurisées

-- Politique pour formations
CREATE POLICY "Allow all operations on formations" ON formations
  FOR ALL USING (true)
  WITH CHECK (true);

-- Politique pour dates
CREATE POLICY "Allow all operations on dates" ON dates
  FOR ALL USING (true)
  WITH CHECK (true);

-- Politique pour avis
CREATE POLICY "Allow all operations on avis" ON avis
  FOR ALL USING (true)
  WITH CHECK (true);

-- Politique pour leads
CREATE POLICY "Allow all operations on leads" ON leads
  FOR ALL USING (true)
  WITH CHECK (true);

-- Politique pour messages
CREATE POLICY "Allow all operations on messages" ON messages
  FOR ALL USING (true)
  WITH CHECK (true);

-- Politique pour analytics
CREATE POLICY "Allow all operations on analytics" ON analytics
  FOR ALL USING (true)
  WITH CHECK (true);