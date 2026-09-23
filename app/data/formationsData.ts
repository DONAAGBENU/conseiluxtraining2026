export interface FormationDetailType {
  id: string
  titre: string
  description: string
  categorie: string
  duree: string
  prix: string
  certifiante: boolean
  certificationName?: string
  modalite?: string
  image?: string
  objectif?: string
  prerequis?: string
  publicCible?: string
  modules: string[]
  pointsForts?: string[]
  createdAt?: string
}

export function getFormationImage(formation: { image?: string; categorie?: string; titre?: string }): string {
  const image = (formation.image || '').trim()
  if (image && (image.startsWith('http') || image.startsWith('/') || image.startsWith('data:'))) {
    return image
  }

  const titleLower = (formation.titre || '').toLowerCase()
  const catLower = (formation.categorie || '').toLowerCase()

  if (titleLower.includes('cyber') || titleLower.includes('sécurité') || titleLower.includes('security') || titleLower.includes('cissp') || titleLower.includes('iso 27001')) {
    return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop'
  }
  if (titleLower.includes('cloud') || titleLower.includes('aws') || titleLower.includes('devops') || titleLower.includes('azure')) {
    return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'
  }
  if (titleLower.includes('projet') || titleLower.includes('pmp') || titleLower.includes('prince2') || titleLower.includes('scrum') || titleLower.includes('agile')) {
    return 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop'
  }
  if (titleLower.includes('intelligence') || titleLower.includes('ia') || titleLower.includes('ai') || titleLower.includes('data')) {
    return 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800&auto=format&fit=crop'
  }
  if (titleLower.includes('commercial') || titleLower.includes('vente') || titleLower.includes('négociation') || titleLower.includes('sales')) {
    return 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop'
  }
  if (titleLower.includes('leadership') || titleLower.includes('management') || titleLower.includes('dirigeant')) {
    return 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop'
  }
  if (titleLower.includes('anglais') || titleLower.includes('toeic') || titleLower.includes('toefl') || titleLower.includes('langue') || catLower.includes('langue')) {
    return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop'
  }
  if (titleLower.includes('finance') || titleLower.includes('audit') || titleLower.includes('gestion') || catLower.includes('filière')) {
    return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
  }
  if (catLower.includes('technologie')) {
    return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop'
  }

  return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'
}
