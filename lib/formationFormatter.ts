export interface ParsedModule {
  index: number
  title: string
  items: string[]
}

export interface ParsedObjectiveDomain {
  title: string
  percentage?: string
  items: Array<{
    highlight?: string
    text: string
  }>
}

export interface ParsedObjectifs {
  intro: string
  domains: ParsedObjectiveDomain[]
}

export interface ParsedPrerequis {
  generalPrerequis: string[]
  eligibilityTitle?: string
  eligibilityIntro?: string
  eligibilityLevels: Array<{
    title: string
    experience: string
    detail?: string
  }>
  note?: string
}

/**
 * Parses raw module strings into structured module objects with uppercase titles and bullet points.
 */
export function parseModules(modules: string[] = []): ParsedModule[] {
  return modules.map((raw, idx) => {
    const trimmed = (raw || '').trim()
    if (!trimmed) {
      return { index: idx + 1, title: `MODULE ${idx + 1}`, items: [] }
    }

    // Pattern 1: Starts with "Module X : Title ..."
    const moduleMatch = trimmed.match(/^(Module\s+\d+\s*:\s*)([^.]+?)(?:(?=\s+[A-ZÀ-ÖØ-ß][a-zà-öø-ÿ]+|[A-ZÀ-ÖØ-ß]'\w+|\n)|$)([\s\S]*)/i)
    
    // Pattern 2: Starts with "Révision intensive" or similar special module
    const revisionMatch = trimmed.match(/^(Révision intensive[^.:]*)(?:[:.]|\s+)([\s\S]*)/i)

    let title = ''
    let items: string[] = []

    if (trimmed.includes('\n')) {
      const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean)
      title = lines[0]
      items = lines.slice(1).map((l) => l.replace(/^[-*•\d.)]\s*/, '').trim()).filter(Boolean)
    } else {
      // Pattern 1: Starts with "Module X : Title ..."
      const modMatch = trimmed.match(/^(Module\s+\d+\s*:\s*.*?\b(?:stratégique|partagée|projet|prenantes|périmètre|l'échéancier|finances|approvisionnements|sécurité|continue|externe|transition))\s+([\s\S]*)$/i)
      const revMatch = trimmed.match(/^(Révision intensive[^\n.]*?)(?:\.|\s+)([\s\S]*)$/i)
      const fallback = trimmed.match(/^(Module\s+\d+\s*:\s*[^.:\n]+)(?:[:.]|\s+(?=[A-ZÀ-ÖØ-ß]'\w+|La\s|Le\s|Les\s|L'|Des\s|Un\s|Une\s))([\s\S]*)$/i)

      let body = ''
      if (modMatch) {
        title = modMatch[1].trim()
        body = modMatch[2].trim()
      } else if (revMatch) {
        title = revMatch[1].trim()
        body = revMatch[2].trim()
      } else if (fallback) {
        title = fallback[1].trim()
        body = fallback[2].trim()
      } else {
        const firstSplit = trimmed.split(/\n|(?<=\.)\s+/)
        title = firstSplit[0].trim()
        body = firstSplit.slice(1).join('\n').trim()
      }

      if (body) {
        const sentences = body.split(/(?<=[.;])\s+(?=[A-ZÀ-ÖØ-ß]|L'|D'|Une|Un|Le|La|Les|Des)/)
        items = sentences.map((s) => s.trim()).filter(Boolean)
      }
    }

    const uppercaseTitle = title.toUpperCase()

    return {
      index: idx + 1,
      title: uppercaseTitle,
      items
    }
  })
}

/**
 * Parses raw objectif text into structured domain blocks with uppercase headings and formatted bullets.
 */
export function parseObjectifs(rawObjectif: string = ''): ParsedObjectifs {
  const text = (rawObjectif || '').trim()
  if (!text) {
    return { intro: '', domains: [] }
  }

  // Detect domain blocks like "Domaine I :", "Domaine II :", "Domaine III :", "Préparation à l'examen"
  const domainRegex = /(Domaine\s+[IVX]+|\bDomaine\s+\d+|Préparation\s+à\s+l'examen[^\n:]*|Objectif\s+\d+)/gi
  const matches = Array.from(text.matchAll(domainRegex))

  if (matches.length === 0) {
    // No specific domain keywords, split by double newlines or bullets
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
    const intro = lines[0] || ''
    const items = lines.slice(1).map((line) => {
      const parts = line.split(':')
      if (parts.length > 1 && parts[0].length < 40) {
        return {
          highlight: parts[0].replace(/^[-*•]\s*/, '').trim(),
          text: parts.slice(1).join(':').trim()
        }
      }
      return { text: line.replace(/^[-*•]\s*/, '').trim() }
    })

    return {
      intro,
      domains: items.length > 0 ? [{ title: 'OBJECTIFS PRINCIPAUX', items }] : []
    }
  }

  // Extract intro (everything before the first domain)
  const firstIndex = matches[0].index ?? 0
  const intro = text.substring(0, firstIndex).trim()

  const domains: ParsedObjectiveDomain[] = []

  for (let i = 0; i < matches.length; i++) {
    const currentMatch = matches[i]
    const startIndex = currentMatch.index ?? 0
    const nextMatch = matches[i + 1]
    const endIndex = nextMatch ? (nextMatch.index ?? text.length) : text.length

    const block = text.substring(startIndex, endIndex).trim()
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)

    if (lines.length > 0) {
      const rawTitle = lines[0]
      // Check for percentage e.g. "(33 % de l'examen)"
      const pctMatch = rawTitle.match(/\((\d+[\s%]*[^\)]*)\)/)
      const percentage = pctMatch ? pctMatch[1] : undefined

      const uppercaseTitle = rawTitle.toUpperCase()

      const items = lines.slice(1).flatMap((line) => {
        // Can also contain multiple items separated by semicolons
        const subItems = line.split(';').map((s) => s.trim()).filter(Boolean)
        return subItems.map((sub) => {
          const colonIdx = sub.indexOf(':')
          if (colonIdx > 0 && colonIdx < 50) {
            return {
              highlight: sub.substring(0, colonIdx).replace(/^[-*•]\s*/, '').trim(),
              text: sub.substring(colonIdx + 1).trim()
            }
          }
          return {
            text: sub.replace(/^[-*•]\s*/, '').trim()
          }
        })
      })

      domains.push({
        title: uppercaseTitle,
        percentage,
        items
      })
    }
  }

  return { intro, domains }
}

/**
 * Parses raw prerequis text into structured blocks with uppercase headings, badges, and criteria.
 */
export function parsePrerequis(rawPrerequis: string = ''): ParsedPrerequis {
  const text = (rawPrerequis || '').trim()
  if (!text) {
    return { generalPrerequis: [], eligibilityLevels: [] }
  }

  const sections = text.split(/(?=Conditions\s+d'éligibilité|À\s+savoir\s*:)/i)

  const generalPrerequis: string[] = []
  let eligibilityTitle = ''
  let eligibilityIntro = ''
  const eligibilityLevels: Array<{ title: string; experience: string; detail?: string }> = []
  let note = ''

  for (const sec of sections) {
    const trimmedSec = sec.trim()
    if (/^Conditions\s+d'éligibilité/i.test(trimmedSec)) {
      const lines = trimmedSec.split('\n').map((l) => l.trim()).filter(Boolean)
      eligibilityTitle = "CONDITIONS D'ÉLIGIBILITÉ À L'EXAMEN PMP (PMI)"
      
      let levelStartIdx = 1
      if (lines[1] && !lines[1].startsWith('-') && !lines[1].startsWith('Bac')) {
        eligibilityIntro = lines[1]
        levelStartIdx = 2
      }

      for (let j = levelStartIdx; j < lines.length; j++) {
        const line = lines[j]
        const clean = line.replace(/^[-*•]\s*/, '')
        const colonIndex = clean.indexOf(':')
        if (colonIndex !== -1) {
          eligibilityLevels.push({
            title: clean.substring(0, colonIndex).trim().toUpperCase(),
            experience: clean.substring(colonIndex + 1).trim()
          })
        } else {
          eligibilityLevels.push({
            title: clean.toUpperCase(),
            experience: ''
          })
        }
      }
    } else if (/^À\s+savoir\s*:/i.test(trimmedSec)) {
      note = trimmedSec.replace(/^À\s+savoir\s*:\s*/i, '').trim()
    } else {
      // General prerequisites
      const lines = trimmedSec.split('\n').map((l) => l.trim()).filter(Boolean)
      for (const line of lines) {
        const clean = line.replace(/^[-*•]\s*/, '').replace(/;\s*$/, '').trim()
        if (clean) generalPrerequis.push(clean)
      }
    }
  }

  return {
    generalPrerequis,
    eligibilityTitle: eligibilityTitle || "CONDITIONS D'ÉLIGIBILITÉ",
    eligibilityIntro,
    eligibilityLevels,
    note
  }
}
