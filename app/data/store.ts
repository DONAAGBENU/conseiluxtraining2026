// Simule une base de données en mémoire
export interface Formation {
  id: string
  titre: string
  description: string
  categorie: string
  duree: string
  prix: string
  certifiante: boolean
  modules: string[]
  createdAt: string
}

export interface DateFormation {
  id: string
  formationId: string
  formationTitre: string
  lieu: string
  date: string
  duree: string
  places: number
  disponibles: number
  createdAt: string
}

export interface Avis {
  id: string
  nom: string
  role: string
  entreprise: string
  texte: string
  note: number
  date: string
  logo: string
  approuve: boolean
  createdAt: string
}

// Données initiales
const formationsInitiales: Formation[] = [
  {
    id: '1',
    titre: 'Gestion de Projet PMP',
    description: 'Préparez-vous à la certification PMP avec notre programme complet',
    categorie: 'Gestion de Projet',
    duree: '5 jours',
    prix: '1 500 000 FCFA',
    certifiante: true,
    modules: ['Introduction au PMP', 'Planification', 'Exécution', 'Suivi et contrôle', 'Clôture'],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    titre: 'Cybersécurité CISSP',
    description: 'Formation complète pour la certification CISSP',
    categorie: 'Technologies & Cybersécurité',
    duree: '5 jours',
    prix: '2 000 000 FCFA',
    certifiante: true,
    modules: ['Sécurité des réseaux', 'Cryptographie', 'Gestion des risques', 'Audit sécurité'],
    createdAt: new Date().toISOString()
  }
]

const datesInitiales: DateFormation[] = [
  {
    id: '1',
    formationId: '1',
    formationTitre: 'Gestion de Projet PMP',
    lieu: 'Cotonou, Bénin',
    date: '15-19 Septembre 2024',
    duree: '5 jours',
    places: 15,
    disponibles: 8,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    formationId: '2',
    formationTitre: 'Cybersécurité CISSP',
    lieu: 'Lomé, Togo',
    date: '22-26 Septembre 2024',
    duree: '5 jours',
    places: 12,
    disponibles: 5,
    createdAt: new Date().toISOString()
  }
]

const avisInitiales: Avis[] = [
  {
    id: '1',
    nom: 'Marie Kouassi',
    role: 'Directrice RH',
    entreprise: 'Groupe SIB',
    texte: 'Grâce à ConseiluxTraining, nous avons certifié 50 collaborateurs en gestion de projet. Un accompagnement exceptionnel.',
    note: 5,
    date: '15 mai 2024',
    logo: '/images/partners/sib.png',
    approuve: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    nom: 'Jean Adé',
    role: 'CEO',
    entreprise: 'Tech Solutions Africa',
    texte: 'La formation en cybersécurité a transformé notre approche. Nos équipes sont désormais certifiées.',
    note: 5,
    date: '12 avril 2024',
    logo: '/images/partners/tech.png',
    approuve: true,
    createdAt: new Date().toISOString()
  }
]

// Store
let formations = [...formationsInitiales]
let datesFormation = [...datesInitiales]
let avis = [...avisInitiales]

// Fonctions CRUD pour les formations
export const getFormations = () => formations
export const getFormationById = (id: string) => formations.find(f => f.id === id)
export const addFormation = (formation: Omit<Formation, 'id' | 'createdAt'>) => {
  const newFormation = {
    ...formation,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }
  formations.push(newFormation)
  return newFormation
}
export const updateFormation = (id: string, data: Partial<Formation>) => {
  const index = formations.findIndex(f => f.id === id)
  if (index !== -1) {
    formations[index] = { ...formations[index], ...data }
    return formations[index]
  }
  return null
}
export const deleteFormation = (id: string) => {
  formations = formations.filter(f => f.id !== id)
}

// Fonctions CRUD pour les dates
export const getDatesFormation = () => datesFormation
export const getDateById = (id: string) => datesFormation.find(d => d.id === id)
export const addDate = (date: Omit<DateFormation, 'id' | 'createdAt'>) => {
  const newDate = {
    ...date,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }
  datesFormation.push(newDate)
  return newDate
}
export const updateDate = (id: string, data: Partial<DateFormation>) => {
  const index = datesFormation.findIndex(d => d.id === id)
  if (index !== -1) {
    datesFormation[index] = { ...datesFormation[index], ...data }
    return datesFormation[index]
  }
  return null
}
export const deleteDate = (id: string) => {
  datesFormation = datesFormation.filter(d => d.id !== id)
}

// Fonctions CRUD pour les avis
export const getAvis = () => avis
export const getAvisApprouves = () => avis.filter(a => a.approuve)
export const addAvis = (avisData: Omit<Avis, 'id' | 'createdAt' | 'approuve'>) => {
  const newAvis = {
    ...avisData,
    id: Date.now().toString(),
    approuve: false,
    createdAt: new Date().toISOString()
  }
  avis.push(newAvis)
  return newAvis
}
export const approuverAvis = (id: string) => {
  const index = avis.findIndex(a => a.id === id)
  if (index !== -1) {
    avis[index].approuve = true
    return avis[index]
  }
  return null
}
export const supprimerAvis = (id: string) => {
  avis = avis.filter(a => a.id !== id)
}