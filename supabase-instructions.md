# Configuration Supabase pour ConseiluxTraining

## Pourquoi cette migration ?

Le problème que vous rencontriez en production était causé par l'utilisation de fichiers JSON locaux pour stocker les données. En production (Vercel, Netlify, etc.), le système de fichiers n'est pas persistant, ce qui causait des erreurs lors de la création de formations et de dates.

## Étapes de configuration

### 1. Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Créez un nouveau projet nommé "conseiluxtraining"
4. Attendez que le projet soit prêt (quelques minutes)

### 2. Configurer les variables d'environnement

Dans votre fichier `.env.local`, ajoutez les variables suivantes :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

Vous pouvez trouver ces valeurs dans votre dashboard Supabase :
- **URL** : Settings → API → Project URL
- **Anon Key** : Settings → API → anon/public key

### 3. Exécuter le script SQL

1. Allez dans votre dashboard Supabase
2. Cliquez sur "SQL Editor" dans le menu de gauche
3. Cliquez sur "New Query"
4. Copiez et collez le contenu du fichier `supabase-setup.sql`
5. Cliquez sur "Run" pour exécuter le script

### 4. Déployer en production

Une fois configuré, vous pouvez :

```bash
git add .
git commit -m "Migrer vers Supabase pour la persistance des données"
git push
```

## Avantages de cette migration

✅ **Persistance des données** : Les données sont stockées dans une vraie base de données
✅ **Fonctionne en production** : Plus de problèmes de fichiers en production
✅ **Backup automatique** : Supabase offre des backups automatiques
✅ **Scalabilité** : Peut gérer beaucoup plus de données
✅ **API REST** : Facile à utiliser et bien documentée

## Sécurité (pour la production)

Pour une production sécurisée, vous devrez modifier les politiques RLS (Row Level Security) pour être plus restrictives. Actuellement, elles sont permissives pour faciliter le développement.

## Support

Si vous avez des problèmes :
1. Vérifiez que vos variables d'environnement sont correctement configurées
2. Vérifiez que le script SQL a été exécuté avec succès
3. Consultez les logs de votre application pour les erreurs