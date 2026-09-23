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
  image: string
  objectif: string
  prerequis: string
  publicCible?: string
  modules: string[]
  pointsForts?: string[]
  createdAt?: string
}

export const FORMATIONS_CATALOG: FormationDetailType[] = [
  {
    id: 'cybersecurite-cissp',
    titre: 'Cybersécurité CISSP® - Certified Information Systems Security Professional',
    description: 'La certification CISSP® (Certified Information Systems Security Professional) est la référence mondiale absolue en matière de cybersécurité et de gouvernance de la sécurité des systèmes d\'information. Délivrée par l\'(ISC)², elle valide l\'expertise technique et managériale des professionnels de sécurité pour concevoir, implémenter et gérer des programmes de cybersécurité de classe mondiale. Cette certification est reconnue par les gouvernements, les organisations internationales et les entreprises Fortune 500 comme le standard de l\'excellence en cybersécurité. Les titulaires du CISSP démontrent une compétence holistique couvrant 8 domaines critiques de la sécurité, allant de la gestion des risques à l\'ingénierie de sécurité, en passant par les opérations de sécurité et le développement sécurisé. Avec plus de 190 000 certifiés dans le monde, le CISSP ouvre des portes vers des postes de leadership stratégique et des opportunités de carrière exceptionnelles, avec des salaires moyens significativement supérieurs à la moyenne du secteur.',
    categorie: 'Technologie numérique',
    duree: '5 jours (35 heures)',
    prix: '2 250 000 FCFA',
    certifiante: true,
    certificationName: 'Certification CISSP® délivrée par l\'(ISC)² - ANSI/ISO 17024 accredited',
    modalite: 'Présentiel & Classe Virtuelle interactive',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
    objectif: 'Maîtriser les 8 domaines du Common Body of Knowledge (CBK) de l\'(ISC)² : Sécurité et Gestion des Risques (16%), Sécurité des Actifs (10%), Architecture et Ingénierie de Sécurité (13%), Sécurité des Communications et des Réseaux (13%), Gestion des Identités et des Accès (13%), Évaluation et Tests de Sécurité (12%), Sécurité des Opérations (13%), Sécurité du Développement Logiciel (10%). Développer l\'expertise nécessaire pour concevoir une architecture de sécurité robuste, piloter la gouvernance des risques organisationnels, implémenter des contrôles de sécurité efficaces et réussir l\'examen de certification CISSP dès la première tentative.',
    prerequis: 'Minimum de 5 années d\'expérience professionnelle cumulative en temps plein dans au moins 2 des 8 domaines du CISSP CBK. Un diplôme universitaire (licence ou master) en informatique, technologies de l\'information ou domaines connexes peut satisfaire jusqu\'à 1 an d\'expérience requise. Les candidats sans l\'expérience requise peuvent devenir "Associate of (ISC)²" après réussite de l\'examen et disposent de 6 ans pour acquérir l\'expérience nécessaire.',
    publicCible: 'Responsables de la Sécurité des Systèmes d\'Information (RSSI/CISO), Directeurs Informatiques (CIO), Architectes Sécurité, Consultants Cybersécurité, Auditeurs Sécurité, Ingénieurs Sécurité, Analystes de Risques, Managers de Sécurité, Directeurs de Conformité, Professionnels aspiring à des rôles de leadership en cybersécurité.',
    modules: [
      'Module 1 : Sécurité et Gestion des Risques (16%) - Éthique professionnelle, concepts de sécurité, gouvernance, conformité, risques juridiques et réglementaires, gestion de la continuité d\'activité',
      'Module 2 : Sécurité des Actifs (10%) - Classification des données, protection de la vie privée, gestion du cycle de vie des actifs, gestion des données',
      'Module 3 : Architecture et Ingénierie de Sécurité (13%) - Modèles de sécurité, cryptographie, sécurité physique, architecture système, conception de réseaux sécurisés',
      'Module 4 : Sécurité des Communications et des Réseaux (13%) - Protocoles sécurisés, segmentation réseau, VPN, sécurité sans fil, menaces réseau',
      'Module 5 : Gestion des Identités et des Accès (13%) - IAM, authentification multi-facteurs, gestion des privilèges, SSO, fédération d\'identité',
      'Module 6 : Évaluation et Tests de Sécurité (12%) - Audits de sécurité, tests d\'intrusion, évaluations de vulnérabilités, penetration testing, reporting',
      'Module 7 : Sécurité des Opérations (13%) - Gestion des incidents, réponse aux incidents, forensics, monitoring, continuité d\'activité, recovery',
      'Module 8 : Sécurité du Développement Logiciel (10%) - Cycle de vie sécurisé (SSDLC), DevSecOps, sécurité dans le développement, testing sécurisé'
    ],
    pointsForts: [
      'Formateur certifié CISSP avec plus de 15 ans d\'expérience terrain et expertise pratique',
      'Accès à une plateforme de simulation d\'examen premium avec plus de 1 500 questions types et analyses détaillées',
      'Cas pratiques et exercices basés sur des incidents de sécurité réels et scénarios d\'entreprise',
      'Accompagnement personnalisé post-formation jusqu\'au passage effectif de l\'examen et processus d\'endorsement',
      'Matériel pédagogique complet incluant manuel officiel, flashcards, cheat sheets et roadmap de préparation',
      'Réseau de 190 000+ professionnels certifiés CISSP worldwide pour networking et opportunités de carrière'
    ]
  },
  {
    id: 'iso-27001-lead-implementer',
    titre: 'Lead Implementer ISO/IEC 27001:2022',
    description: 'La certification ISO/IEC 27001 Lead Implementer vous permet d\'acquérir l\'expertise nécessaire pour concevoir, déployer, maintenir et améliorer continuellement un Système de Management de la Sécurité de l\'Information (SMSI) conforme à la norme internationale ISO/IEC 27001:2022. Cette formation intensive de 5 jours couvre l\'ensemble du cycle de vie d\'un SMSI, depuis l\'analyse du contexte organisationnel jusqu\'à la préparation réussie de l\'audit de certification tierce partie. Vous maîtriserez la méthodologie IMS2 (Integrated Management System) et les meilleures pratiques pour gérer les risques informationnels, implémenter les 93 contrôles de sécurité de l\'Annexe A, et établir une gouvernance de sécurité alignée sur les objectifs business. Cette certification est particulièrement stratégique dans un contexte où les menaces cybernétiques, les exigences réglementaires (RGPD, SOX, PCI-DSS) et les attentes des clients en matière de sécurité des données sont de plus en plus strictes. Les organisations certifiées ISO 27001 démontrent leur engagement envers la protection des informations sensibles et gagnent un avantage compétitif significatif sur les marchés internationaux.',
    categorie: 'Technologie numérique',
    duree: '5 jours (35 heures)',
    prix: '1 950 000 FCFA',
    certifiante: true,
    certificationName: 'Certification PECB Certified ISO/IEC 27001 Lead Implementer',
    modalite: 'Présentiel, Blended Learning ou Distanciel',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
    objectif: 'Maîtriser les fondamentaux de la gestion de la sécurité de l\'information selon ISO 27001:2022. Interpréter et implémenter les exigences de la norme dans le contexte spécifique de votre organisation. Planifier et piloter un projet d\'implémentation SMSI en utilisant la méthodologie IMS2 et les meilleures pratiques ISO 10006 (gestion de projet qualité). Mener des analyses de risques rigoureuses selon ISO 27005, établir la Déclaration d\'Applicabilité (SoA), et sélectionner les contrôles appropriés. Opérer, maintenir et améliorer continuellement le SMSI, et préparer efficacement l\'organisation pour l\'audit de certification tierce partie.',
    prerequis: 'Connaissances générales en systèmes d\'information et concepts de sécurité. Expérience professionnelle en IT, sécurité, gouvernance ou conformité recommandée. Compréhension de base des normes ISO et des principes de management de la qualité.',
    publicCible: 'Responsables de la Sécurité des Systèmes d\'Information (RSSI), Chefs de projet SMSI, Directeurs de la Conformité, Auditeurs Internes, Consultants en Gouvernance et Sécurité, Gestionnaires de Risques, Directeurs Informatiques, Professionnels souhaitant devenir experts en implémentation SMSI.',
    modules: [
      'Module 1 : Introduction aux concepts SMSI ISO/IEC 27001:2022 et initiation du projet - Principes fondamentaux, famille ISO 27000, analyse de maturité ISO 21827, business case et plan de projet',
      'Module 2 : Planification de l\'implémentation SMSI - Définition du périmètre, politiques SMSI, sélection de la méthodologie d\'appréciation des risques, gestion des risques selon ISO 27005, Statement of Applicability (SoA)',
      'Module 3 : Implémentation du SMSI - Framework de gestion documentaire, conception et implémentation des contrôles, mesures de sécurité organisationnelles, humaines, physiques et technologiques',
      'Module 4 : Opération et monitoring du SMSI - Surveillance, mesure, reporting, audit interne, revue de direction, management review et amélioration continue',
      'Module 5 : Préparation à la certification - Préparation de l\'audit tierce partie, gestion des non-conformités, plan d\'action correctif, maintien de la certification et amélioration continue'
    ],
    pointsForts: [
      'Méthodologie IMS2 éprouvée et alignée sur ISO 10006 pour la gestion de projet de mise en œuvre',
      'Plus de 50 modèles de livrables et politiques types prêts à l\'emploi (politiques, procédures, registres, matrices)',
      'Études de cas pratiques et mises en situation adaptées au contexte africain et international',
      'Examen de certification inclus avec support complet pour la préparation et réussite',
      'Compatibilité totale avec ISO 27003 (guidelines implémentation), ISO 27004 (mesure sécurité) et ISO 27005 (gestion risques)'
    ]
  },
  {
    id: 'gestion-projet-pmp',
    titre: 'Gestion de Projet PMP® - Project Management Professional',
    description: 'La certification PMP® (Project Management Professional) du PMI (Project Management Institute) est la plus prestigieuse et la plus reconnue mondialement pour les professionnels de gestion de projet. Elle valide votre capacité à diriger des personnes, gérer des processus et piloter les priorités business dans n\'importe quelle industrie et quelle que soit la méthodologie (prédictive, agile ou hybride). Contrairement aux certifications focalisées sur une seule méthodologie, le PMP démontre votre expertise adaptable et transférable across industries et géographies. Les titulaires PMP bénéficient en moyenne de salaires 17% supérieurs aux non-certifiés et ont accès à un réseau mondial de plus de 1 million de professionnels. Le nouveau format d\'examen PMP 2026 intègre des émergences comme l\'IA, la durabilité et la livraison de valeur, reflétant l\'évolution du métier de chef de projet. Cette formation vous prépare complètement à l\'examen tout en développant des compétences pratiques immédiatement applicables à vos projets.',
    categorie: 'Gestion de projet',
    duree: '5 jours intensifs (35 PDU)',
    prix: '1 800 000 FCFA',
    certifiante: true,
    certificationName: 'Certification PMP® délivrée par le PMI (Project Management Institute) - ISO/ANSI 17024 accredited',
    modalite: 'Présentiel ou Classe Virtuelle',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
    objectif: 'Acquérir les 35 heures de contact obligatoires pour l\'éligibilité PMP. Maîtriser les 3 domaines d\'évaluation du nouvel examen PMP : Personnes (42%), Processus (50%), Environnement d\'affaires (8%). Développer les compétences clés en leadership, gestion d\'équipe, négociation et communication. Maîtriser les approches prédictives (PMBOK® 7), agiles (Scrum, Kanban) et hybrides. Comprendre la gouvernance de projet, l\'alignement stratégique et la livraison de valeur business. Maximiser vos chances de réussite dès la première tentative grâce à une préparation intensive et personnalisée.',
    prerequis: 'Bac+4/5 avec 3 ans d\'expérience en leading/management de projet (60 mois/5 ans si seulement Bac), ou Bac avec 5 ans d\'expérience. 35 heures de formation en gestion de projet (cette formation satisfait ce critère). Expérience pratique en pilotage de projets fortement recommandée.',
    publicCible: 'Chefs de projet seniors, Directeurs de programmes, Membres de PMO, Ingénieurs et Managers pilotant des projets stratégiques, Professionnels aspirant à des rôles de leadership en gestion de projet, Consultants en transformation digitale.',
    modules: [
      'Module 1 : Fondations de la gestion de projet moderne et cadre PMI - PMBOK® 7, Guide Agile Practice, évolutions du métier, éthique professionnelle',
      'Module 2 : Domaine Personnes (42%) - Leadership d\'équipe, constitution d\'équipes performantes, motivation, négociation, gestion des conflits, communication efficace, coaching',
      'Module 3 : Domaine Processus (50%) - Intégration, périmètre, planning, coûts, qualité, ressources, communications, risques, approvisionnements, stakeholders',
      'Module 4 : Approches Agiles et Hybrides - Scrum, Kanban, pilotage adaptatif, frameworks agiles, transformation agile, hybridation prédictif/agile',
      'Module 5 : Domaine Environnement d\'affaires (8%) - Gouvernance, conformité, structures organisationnelles, alignement stratégique, bénéfices organisationnels',
      'Module 6 : Préparation intensive à l\'examen PMP - Simulateur avec 2 000+ questions, analyse des pièges, gestion du temps, stratégies de réponse, mock exams'
    ],
    pointsForts: [
      'Attestation officielle de 35 Contact Hours obligatoire pour le dossier d\'éligibilité PMI',
      'Simulateur d\'examen exclusif avec plus de 2 000 questions types et analyses détaillées',
      'Revue personnalisée et validation de votre dossier d\'inscription PMI avant soumission',
      'Matériel complet : PMBOK® Guide 7, Agile Practice Guide, flashcards, cheat sheets, roadmap de préparation',
      'Support post-formation : accompagnement jusqu\'au passage de l\'examen, community access pour networking'
    ]
  },
  {
    id: 'prince2-practitioner',
    titre: 'PRINCE2® Foundation & Practitioner',
    description: 'PRINCE2® (Projects IN Controlled Environments) est la méthodologie de gestion de projet la plus adoptée mondialement, particulièrement en Europe et dans les organisations internationales et gouvernementales. Cette formation combinée Foundation & Practitioner vous permet d\'acquérir une maîtrise complète de la méthode, des concepts fondamentaux jusqu\'à l\'application avancée dans des contextes réels. PRINCE2 est reconnu pour sa capacité à structurer rigoureusement les projets tout en offrant une flexibilité d\'adaptation à tous les types d\'organisations et tailles de projets. La version 7 de PRINCE2 intègre des évolutions majeures : accent renforcé sur le leadership et les personnes, intégration des pratiques agiles, et focus sur la livraison de valeur business. Les certifications PRINCE2 sont demandées par les institutions financières, les gouvernements, les entreprises multinationales et les organismes internationaux comme preuve de compétence en gestion de projet structurée.',
    categorie: 'Gestion de projet',
    duree: '5 jours (35 heures)',
    prix: '1 650 000 FCFA',
    certifiante: true,
    certificationName: 'Certifications PRINCE2® Foundation & Practitioner (PeopleCert)',
    modalite: 'Présentiel & Distanciel',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop',
    objectif: 'Foundation : Maîtriser les concepts fondamentaux de PRINCE2, les 7 principes, 7 thèmes et 7 processus. Comprendre comment la méthode structure la gestion de projet et assure la réussite. Practitioner : Savoir appliquer et adapter PRINCE2 à des contextes spécifiques, résoudre des problèmes complexes et scénarios réels. Développer l\'expertise pour tailorer la méthode selon la taille, complexité et environnement du projet. Réussir les deux examens (Foundation : 60 questions, 60 minutes, 60% ; Practitioner : 68 questions, 150 minutes, 55%).',
    prerequis: 'Aucun prérequis spécifique pour Foundation. L\'obtention de la certification Foundation est obligatoire pour passer l\'examen Practitioner. Expérience en gestion de projet recommandée pour maximiser les bénéfices de la formation.',
    publicCible: 'Chefs de projet, Directeurs opérationnels, Membres d\'équipes de projet, Consultants en gestion de projet, Professionnels de PMO, Managers devant piloter ou participer à des projets structurés.',
    modules: [
      'Module 1 : Vue d\'ensemble PRINCE2 et les 7 Principes - Continued business justification, Learn from experience, Defined roles, Manage by stages, Manage by exception, Focus on products, Tailor to suit',
      'Module 2 : Les 7 Thèmes PRINCE2 - Business Case, Organisation, Quality, Plans, Risk, Change, Progression, et leur application pratique',
      'Module 3 : Les 7 Processus PRINCE2 - Starting up a project, Directing a project, Initiating a project, Controlling a stage, Managing product delivery, Managing stage boundary, Closing a project',
      'Module 4 : Adaptation (Tailoring) de PRINCE2 - Application à différents contextes, tailoring pour agile, tailoring par taille et complexité de projet',
      'Module 5 : Leadership et personnes dans PRINCE2 - Gestion d\'équipe, communication, motivation, compétences clés du chef de projet',
      'Module 6 : Préparation intensive aux examens - Exercices pratiques, examens blancs commentés, stratégies de réponse, temps management'
    ],
    pointsForts: [
      'Méthodologie reconnue par les bailleurs de fonds, gouvernements et multinationales comme standard de gestion de projet',
      'Support de cours officiel "Managing Successful Projects with PRINCE2" inclus',
      'Passage des 2 examens (Foundation & Practitioner) inclus dans la formation',
      'Taux de réussite supérieur à 94% grâce à notre méthodologie pédagogique éprouvée',
      'Approche combinée Foundation + Practitioner pour économiser du temps et assurer une cohérence d\'apprentissage'
    ]
  },
  {
    id: 'management-leadership-posture',
    titre: 'Management & Leadership : Posture du Leader et Pilotage de la Performance',
    description: 'Cette formation immersive de 3 jours vous permet d\'affirmer votre posture managériale et de développer un leadership situationnel efficace pour mobiliser vos équipes vers l\'excellence opérationnelle. Dans un environnement business volatile où les attentes envers les managers sont de plus en plus élevées, la capacité à adapter son style de leadership, communiquer avec impact et piloter la performance devient un avantage compétitif critique. Notre approche combine théorie avancée du leadership, mises en situation filmées avec débriefing personnalisé par coach certifié, et construction d\'un plan d\'action managérial individuel à 90 jours. Vous développerez votre intelligence émotionnelle, maîtriserez les techniques de feedback constructif et de résolution de conflits, et apprendrez à conduire le changement avec succès. Cette formation est particulièrement adaptée aux managers devant gérer des équipes hybrides, multigénérationnelles ou interculturelles.',
    categorie: 'Management et leadership',
    duree: '3 jours (21 heures)',
    prix: '950 000 FCFA',
    certifiante: true,
    certificationName: 'Certificat Professionnel Conseilux Executive Leadership',
    modalite: 'Présentiel immersif & Ateliers pratiques',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
    objectif: 'Développer son intelligence émotionnelle et conscience de soi pour un leadership authentique. Maîtriser le leadership situationnel : adapter son style selon le niveau d\'autonomie et la maturité des collaborateurs. Acquérir des techniques de communication interpersonnelle avancées pour influencer et inspirer. Maîtriser l\'art du feedback constructif, de la reconnaissance et de la gestion des conflits. Développer des compétences de délégation responsabilisante avec fixation d\'objectifs SMART et suivi de performance. Apprendre à conduire le changement organisationnel et à gérer la résistance au changement. Créer un climat de confiance, de motivation et de cohésion d\'équipe pérenne. Construire et mettre en œuvre un plan d\'action managérial personnalisé à 90 jours.',
    prerequis: 'Occuper actuellement un poste de manager, chef d\'équipe, ou être pressenti à une fonction managériale. Expérience minimale de 6 mois en management recommandée pour maximiser les bénéfices de la formation.',
    publicCible: 'Directeurs, Chefs de département, Managers d\'équipe, Responsables RH, Entrepreneurs et business leaders, Professionnels en transition vers des rôles managériaux.',
    modules: [
      'Module 1 : Diagnostic et conscience de soi - Styles de leadership, posture managériale, forces et axes d\'amélioration, intelligence émotionnelle',
      'Module 2 : Leadership situationnel - Adapter son style selon autonomie et maturité des collaborateurs, délégation efficace, empowerment',
      'Module 3 : Communication et influence - Communication interpersonnelle avancée, feedback constructif, reconnaissance, écoute active',
      'Module 4 : Gestion des conflits et résolution de problèmes - Techniques de médiation, désamorçage des conflits, négociation interne',
      'Module 5 : Pilotage de la performance - Objectifs SMART, suivi de performance, évaluation, développement des talents',
      'Module 6 : Conduite du changement et motivation - Gestion du changement, motivation des équipes, cohésion, plan d\'action managérial'
    ],
    pointsForts: [
      'Mises en situation filmées avec débriefing personnalisé par coach certifié en leadership',
      'Plan d\'action managérial individuel à 90 jours construit et validé durant la formation',
      'Richesse des échanges entre pairs et partage de bonnes pratiques managériales',
      'Approche pratique immédiate avec outils et templates prêts à l\'emploi',
      'Suivi post-formation pour mesurer l\'impact et ajuster le plan d\'action'
    ]
  },
  {
    id: 'performance-commerciale-b2b',
    titre: 'Performance Commerciale & Négociation Stratégique B2B',
    description: 'Cette formation intensive de 3 jours vous permet de maîtriser l\'art de la vente complexe B2B et de développer des compétences de négociation stratégique pour maximiser vos marges et conclure des contrats à forte valeur ajoutée. Dans un environnement commercial hypercompétitif où les cycles de vente s\'allongent et les clients sont de plus en plus informés, la capacité à structurer une démarche commerciale professionnelle, mener des entretiens de découverte approfondis et traiter efficacement les objections devient déterminante. Notre approche combine les méthodologies éprouvées (SPIN Selling, Challenger Sale, Value Selling) avec des simulations de négociation en face à face basées sur des cas d\'affaires réels. Vous développerez des compétences immédiatement applicables : prospection ciblée, construction de propositions de valeur irrésistibles, traitement des objections de prix, et closing efficace. Cette formation est particulièrement adaptée aux commerciaux grands comptes et ingénieurs commerciaux opérant dans des environnements de vente complexe.',
    categorie: 'Performance commerciale',
    duree: '3 jours (21 heures)',
    prix: '850 000 FCFA',
    certifiante: true,
    certificationName: 'Certificat Conseilux B2B Sales Master',
    modalite: 'Présentiel & Training intensif',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    objectif: 'Structurer une démarche commerciale B2B professionnelle et systématique. Maîtriser les techniques de prospection ciblée : Social Selling, Outbound prospection, cartographie des comptes clés. Développer des compétences en entretiens de découverte approfondis en utilisant les méthodologies SPIN Selling et Challenger Sale. Construire des propositions de valeur irrésistibles et des pitches percutants alignés sur les enjeux business clients. Maîtriser les stratégies de négociation avancée pour défendre vos marges et désamorcer les tactiques d\'achat. Acquérir des techniques de closing efficace et développer des stratégies de foisonnement (Up-selling/Cross-selling). Gérer le suivi client et construire des relations commerciales durables.',
    prerequis: 'Expérience minimale en vente, commerce ou relation client. Ouverture aux techniques de vente modernes et volonté d\'améliorer ses performances commerciales.',
    publicCible: 'Commerciaux grands comptes, Ingénieurs commerciaux, Directeurs des ventes, Account managers, Chefs d\'entreprise, Professionnels en transition vers des rôles commerciaux B2B.',
    modules: [
      'Module 1 : Prospection et cartographie des comptes - Social Selling, Outbound prospection, identification des decision makers, cartographie des comptes clés',
      'Module 2 : Découverte approfondie des enjeux clients - Méthode SPIN Selling, Challenger Sale, questioning techniques, identification des pain points',
      'Module 3 : Construction de proposition de valeur - Value Selling, pitch percutant, differentiation, ROI calculation',
      'Module 4 : Négociation stratégique avancée - Traitement des objections de prix, défense des marges, désamorçage des tactiques d\'achat, value-based negotiation',
      'Module 5 : Closing et développement business - Closing techniques, Up-selling/Cross-selling, suivi client, relationship building'
    ],
    pointsForts: [
      'Simulations de négociation en face à face avec cas d\'affaires réels et débriefing détaillé',
      'Outils et trames de pitch immédiatement applicables sur le terrain avec templates personnalisables',
      'Méthodes issues des meilleures pratiques internationales de vente consultative et negotiation',
      'Approche pratique avec 70% de temps consacré aux mises en situation et role-plays',
      'Matériel complet incluant scripts, templates, checklists et outils de suivi commercial'
    ]
  },
  {
    id: 'ia-generative-automatisation-entreprise',
    titre: 'Intelligence Artificielle Générative & Automatisation pour Entreprises',
    description: 'Cette formation de pointe vous permet de transformer radicalement vos méthodes de travail et de gagner jusqu\'à 30% de productivité grâce à l\'intelligence artificielle générative et l\'automatisation sans code. Au-delà de l\'utilisation basique de ChatGPT, vous maîtriserez les concepts avancés de prompt engineering, les agents IA et l\'automatisation de workflows professionnels. 71% des organisations utilisent déjà la GenAI dans au moins une fonction business, mais il y a un déficit critique de talents : seulement 1 professionnel qualifié pour 10 postes ouverts. Cette formation comble ce gap en vous formant aux compétences les plus demandées du marché : IA générative appliquée, automatisation intelligente, et intégration business-first de l\'IA. Vous apprendrez à identifier les cas d\'usage à fort ROI, déployer des workflows IA responsables, et construire une feuille de route d\'adoption alignée sur les objectifs business, le tout sans nécessiter de compétences en programmation.',
    categorie: 'Technologie numérique',
    duree: '3 jours (21 heures)',
    prix: '950 000 FCFA',
    certifiante: true,
    certificationName: 'Certificat Conseilux IA & Productivité d\'Entreprise',
    modalite: 'Présentiel pratique ou Distanciel avec labs',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800&auto=format&fit=crop',
    objectif: 'Comprendre le paysage IA complet : IA, Machine Learning, Neural Networks, et leur relation avec les outils actuels (ChatGPT, Claude, Gemini, Copilot). Maîtriser les mécanismes des Large Language Models (LLMs) et gérer les phénomènes d\'hallucination. Développer des techniques de prompt engineering avancées et les appliquer directement dans des workflows professionnels réels. Utiliser les outils IA pour des tâches workplace : rédaction d\'emails, rapports, génération d\'images, contenus multimédias. Concevoir et déployer des agents IA pour automatiser des tâches complexes : scheduling, analytics dashboards, génération de sites. Automatiser des workflows business avec des outils no-code (Make, Zapier, Power Automate). Évaluer les opportunités IA selon critères de faisabilité, ROI et impact. Construire des roadmaps d\'adoption IA alignées sur les KPIs business.',
    prerequis: 'Aisance avec les outils bureautiques courants (Microsoft Office, Google Workspace) et navigation web. Ouverture aux nouvelles technologies et volonté d\'expérimenter. Aucune compétence technique ou programmation requise.',
    publicCible: 'Cadres, Managers, Consultants, Analystes, Responsables Marketing, RH, Décideurs, Professionnels souhaitant booster leur productivité par l\'IA, Entrepreneurs et business leaders voulant intégrer l\'IA dans leurs opérations.',
    modules: [
      'Module 1 : Démystification de l\'IA - Paysage IA complet, LLMs mécanismes, outils actuels (ChatGPT, Claude, Gemini, Copilot), gestion des hallucinations',
      'Module 2 : Prompt Engineering avancé - Techniques professionnelles, patterns répétables, bibliothèque de prompts, application dans workflows réels',
      'Module 3 : IA pour la bureautique d\'entreprise - Rédaction professionnelle, analyse de données, synthèse documentaire, création de visuels et présentations',
      'Module 4 : Automatisation intelligente sans code - Outils (Make, Zapier, Power Automate), création de workflows automatisés, intégration IA dans processus existants',
      'Module 5 : Agents IA et cas d\'usage avancés - Agents pour scheduling, analytics, génération de contenus, support client, classification et routing',
      'Module 6 : Stratégie et gouvernance IA - Évaluation ROI, gestion des risques, data privacy, éthique, conformité réglementaire, roadmap d\'adoption'
    ],
    pointsForts: [
      '80% de pratique sur vos propres cas d\'usage professionnels pour une application immédiate',
      'Bibliothèque exclusive de 100+ prompts d\'experts prêts à l\'emploi par fonction business',
      'Mise en place concrète d\'au moins une automatisation opérationnelle par participant',
      'Approche business-first : focus sur ROI, cas d\'usage à impact mesurable et KPIs business',
      'Formation mise à jour en continu avec les dernières évolutions IA et outils du marché'
    ]
  },
  {
    id: 'centre-de-langues-anglais-toeic',
    titre: 'Anglais Professionnel Intensif & Préparation Certifiante TOEIC / TOEFL',
    description: 'Cette formation intensive vous permet de développer une aisance professionnelle en anglais dans un contexte international et de préparer efficacement les certifications TOEIC® (Test of English for International Communication) et TOEFL® (Test of English as a Foreign Language). Le TOEIC est le standard mondial pour l\'anglais des affaires, accepté par plus de 14 000 entreprises internationales dans 160 pays, avec 7 millions de candidats annuels. Le TOEFL est quant à lui requis par plus de 9 000 universités et institutions académiques pour l\'admission des étudiants internationaux. Notre approche blended learning combine face-à-face pédagogique intensif et laboratoire multimédia pour optimiser votre progression. Vous développerez non seulement les compétences linguistiques mais aussi les stratégies de test spécifiques pour maximiser votre score. Les formateurs sont des natifs bilingues certifiés TESOL/CELTA avec une expertise en préparation aux examens standardisés.',
    categorie: 'Langues',
    duree: '40 heures (Formules intensives ou cours du soir)',
    prix: '450 000 FCFA',
    certifiante: true,
    certificationName: 'Préparation et passage officiel du test TOEIC® / TOEFL®',
    modalite: 'Blended Learning (Face-à-face pédagogique & Laboratoire multimédia)',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
    objectif: 'Renforcer significativement l\'expression orale et écrite en contexte professionnel international. Acquérir les réflexes grammaticaux et lexicaux clés pour les situations business. Développer la confiance en communication professionnelle : réunions, présentations, négociations, entretiens. Maîtriser les stratégies et méthodologies spécifiques aux épreuves TOEIC (Listening & Reading) et TOEFL (Reading, Writing, Listening, Speaking). Optimiser vos performances aux examens standardisés avec techniques de time management et gestion du stress. Atteindre le score cible pour vos objectifs professionnels (mobilité internationale, promotions) ou académiques (admissions universitaires, bourses).',
    prerequis: 'Test de positionnement initial gratuit avant l\'entrée en formation pour déterminer votre niveau actuel et vous placer dans le groupe approprié. Aucun prérequis minimum, mais motivation et engagement requis pour une progression optimale.',
    publicCible: 'Professionnels et cadres souhaitant améliorer leur anglais business, Candidats à la mobilité internationale, Étudiants préparant des admissions universitaires à l\'étranger, Candidats à des bourses d\'études internationales, Professionnels devant passer des certifications pour des exigences professionnelles.',
    modules: [
      'Module 1 : Business Communication - Réunions, présentations, négociations, emails professionnels, calls et conférences en anglais',
      'Module 2 : Business Writing - Rédaction de mails percutants, rapports de synthèse, correspondances formelles, propositions commerciales',
      'Module 3 : Compréhension orale avancée - Accents variés (US, UK, international), conférences, appels téléphoniques, discussions business',
      'Module 4 : Stratégies TOEIC - Méthodologies Listening & Reading, types de questions, time management, exam techniques',
      'Module 5 : Stratégies TOEFL - Préparation aux 4 sections (Reading, Writing, Listening, Speaking), response templates, speaking practice',
      'Module 6 : Practice exams - Examens blancs en conditions réelles, corrections personnalisées, analyse des points d\'amélioration'
    ],
    pointsForts: [
      'Formateurs bilingues natifs certifiés TESOL/CELTA avec expertise en préparation d\'examens',
      'Test de positionnement gratuit avant et après la session pour mesurer votre progression',
      'Accès illimité à la plateforme numérique d\'auto-apprentissage pendant toute la durée du parcours',
      'Passage des examens officiels TOEIC/TOEFL organisé via nos centres partenaires agréés',
      'Petits groupes (maximum 8 participants) pour un apprentissage personnalisé et efficace'
    ]
  },
  {
    id: 'cloud-aws-solutions-architect',
    titre: 'Cloud Computing AWS Solutions Architect - Associate',
    description: 'La certification AWS Certified Solutions Architect - Associate est la référence pour les professionnels qui conçoivent des architectures sur Amazon Web Services. Cette formation complète vous permet de maîtriser la conception de solutions cloud hautement disponibles, résilientes, sécurisées et optimisées en coûts. Vous apprendrez à appliquer le framework AWS Well-Architected Framework qui couvre 4 piliers : excellence opérationnelle, sécurité, fiabilité, efficacité de performance et optimisation des coûts. L\'examen SAA-C03 évalue votre capacité à recommander des solutions AWS qui répondent aux besoins clients, avec une compréhension approfondie des services de calcul, stockage, bases de données, réseau et sécurité. Avec l\'adoption massive du cloud et la demande croissante d\'architectes cloud, cette certification ouvre des opportunités de carrière exceptionnelles et des salaires très compétitifs. Nos labs pratiques sur comptes AWS dédiés vous permettent de développer une expérience concrète directement applicable en environnement de production.',
    categorie: 'Technologie numérique',
    duree: '5 jours (35 heures)',
    prix: '1 950 000 FCFA',
    certifiante: true,
    certificationName: 'Certification AWS Certified Solutions Architect - Associate (SAA-C03)',
    modalite: 'Présentiel & Labs pratiques sur compte AWS dédié',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop',
    objectif: 'Maîtriser les services fondamentaux AWS : Compute (EC2, Lambda), Storage (S3, EBS, EFS), Database (RDS, Aurora, DynamoDB), Networking (VPC, ELB), Security (IAM, KMS). Concevoir des architectures cloud résilientes et hautement disponibles utilisant des patterns multi-AZ et multi-region. Appliquer le AWS Well-Architected Framework pour concevoir des solutions optimisées selon les 4 piliers. Sécuriser les architectures avec IAM, VPC, security groups, encryption et monitoring. Optimiser les coûts avec les modèles de pricing AWS, cost optimization et finops. Développer les compétences pratiques pour passer l\'examen SAA-C03 (130 minutes, 65 questions) et devenir job-ready en tant qu\'architecte cloud.',
    prerequis: 'Notions de base en administration système, réseaux IP et virtualisation. Expérience en IT ou développement recommandée. Compréhension des concepts cloud fondamentaux (IaaS, PaaS, SaaS). Aucune expérience AWS préalable requise mais bénéfique.',
    publicCible: 'Architectes de solutions, Ingénieurs cloud, Administrateurs systèmes et réseaux, Développeurs seniors, Consultants IT, Professionnels souhaitant se spécialiser dans le cloud computing.',
    modules: [
      'Module 1 : Fondamentaux Cloud AWS - Infrastructure mondiale, régions, availability zones, edge locations, pricing models',
      'Module 2 : Réseau sécurisé avec Amazon VPC - Sous-réseaux, route tables, internet gateways, NAT gateways, VPN, Direct Connect, Transit Gateway',
      'Module 3 : Compute et Conteneurs - EC2 instance types, Auto Scaling Groups, Elastic Load Balancing, ECS/EKS containers, Lambda serverless, Fargate',
      'Module 4 : Stockage et Bases de Données - S3 object storage, EBS block storage, EFS file storage, RDS relational databases, Aurora, DynamoDB NoSQL, ElastiCache',
      'Module 5 : Sécurité et Monitoring - IAM policies and roles, KMS encryption, AWS Shield, WAF, CloudWatch monitoring, CloudTrail auditing, Config compliance',
      'Module 6 : Architecture Well-Architected - Framework 4 piliers, best practices, design patterns, cost optimization, migration strategies, exam preparation'
    ],
    pointsForts: [
      'Comptes AWS de laboratoire dédiés avec crédits pour toute la durée des TP pratiques',
      'Plus de 50% du temps consacré à des ateliers pratiques en environnement AWS réel',
      'Formateur certifié AWS Solutions Architect Professional avec expérience terrain',
      'Préparation complète à l\'examen SAA-C03 avec practice questions et mock exams',
      'Matériel officiel AWS inclus : exam guide, documentation, whitepapers et architecture patterns'
    ]
  },
  {
    id: 'itil-4-foundation',
    titre: 'ITIL® 4 Foundation - Gestion des Services Informatiques (ITSM)',
    description: 'ITIL® 4 (Information Technology Infrastructure Library) est le cadre de référence mondial pour la gestion des services informatiques (ITSM), adopté par des milliers d\'organisations pour aligner les services IT sur les besoins stratégiques des entreprises et optimiser la valeur délivrée. La version 4 d\'ITIL représente une évolution majeure qui intègre les concepts modernes de DevOps, Agile, Lean et Digital Transformation. Cette formation de 3 jours vous permet de maîtriser les concepts fondamentaux d\'ITIL 4, comprendre le Système de Valeur des Services (SVS), les 4 dimensions de la gestion des services, et les 34 pratiques ITIL. La certification ITIL 4 Foundation est reconnue internationalement comme le standard de compétences en ITSM et est souvent exigée pour les rôles de gestion de services IT, support, et transformation digitale. Notre approche pédagogique combine théorie, études de cas et préparation intensive à l\'examen.',
    categorie: 'Technologie numérique',
    duree: '3 jours (21 heures)',
    prix: '1 250 000 FCFA',
    certifiante: true,
    certificationName: 'Certification officielle ITIL® 4 Foundation (PeopleCert)',
    modalite: 'Présentiel & Distanciel',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    objectif: 'Comprendre les concepts clés de la gestion des services IT : valeur, co-création, relations de service, organistions, flux de valeur. Maîtriser les 7 principes directeurs ITIL 4 : focus sur la valeur, progresser par itérations, collaborer, penser et travailler holistiquement, garder les choses simples, optimiser et automatiser. Comprendre les 4 dimensions de la gestion des services : organisations et personnes, information et technologie, partenaires et fournisseurs, flux de valeur et processus. Maîtriser le Système de Valeur des Services (SVS) et la chaîne de valeur des services. Connaître les 34 pratiques ITIL (gestion, technique, pratiques générales) et leur application. Réussir l\'examen ITIL 4 Foundation (40 questions, 60 minutes, 65% pass mark).',
    prerequis: 'Aucun prérequis particulier pour cette formation. Une familiarité avec l\'environnement IT et les concepts de services informatiques est un plus mais non obligatoire.',
    publicCible: 'Membres des équipes de support IT, Responsables d\'exploitation, Consultants ITSM, Directeurs informatiques, Professionnels IT impliqués dans la gestion de services, Personnel en transition vers des rôles ITSM.',
    modules: [
      'Module 1 : Concepts clés de la gestion des services - Valeur, co-création, relations de service, organisation, flux de valeur',
      'Module 2 : Les 7 principes directeurs ITIL 4 - Focus sur la valeur, progresser par itérations, collaborer, holistique, simplicité, optimisation, automatisation',
      'Module 3 : Les 4 dimensions de la gestion des services - Organisations et personnes, information et technologie, partenaires et fournisseurs, flux de valeur et processus',
      'Module 4 : Le Système de Valeur des Services (SVS) - Chaîne de valeur, création de valeur, gouvernance, amélioration continue',
      'Module 5 : Les pratiques ITIL 4 - 34 pratiques (gestion, techniques, générales) : incidents, problèmes, changements, niveaux de service, monitoring, etc.',
      'Module 6 : Préparation intensive à l\'examen - Exam blancs, analyse des questions types, stratégies de réponse, time management'
    ],
    pointsForts: [
      'Manuel officiel ITIL 4 Foundation et voucher d\'examen PeopleCert inclus dans la formation',
      'Approche moderne reliant ITIL 4 aux concepts DevOps, Agile, Lean et Digital Transformation',
      'Taux de réussite excellent grâce à notre méthodologie de préparation éprouvée',
      'Formateurs certifiés ITIL 4 avec expérience pratique en implémentation ITSM'
    ]
  },
  {
    id: 'scrum-master-agile',
    titre: 'Scrum Master Professionnel (PSM I / CSM) & Pratiques Agiles',
    description: 'Le rôle de Scrum Master est devenu stratégique dans les organisations adoptant les méthodes agiles pour accélérer la livraison de valeur et améliorer la collaboration. Cette formation intensive de 2 jours vous permet de devenir un facilitateur expert du succès de vos projets en maîtrisant le cadre Scrum, le coaching d\'équipe et l\'animation de sprints performants. Vous développerez une compréhension profonde de la philosophie agile et de la théorie empirique de Scrum, ainsi que les compétences pratiques pour éliminer les obstacles, faciliter les événements Scrum et coacher l\'équipe vers l\'excellence. La certification Professional Scrum Master (PSM I) de Scrum.org est reconnue mondialement comme le standard de compétence en Scrum et n\'exige aucun frais de renouvellement annuel, contrairement à d\'autres certifications. Notre pédagogie active utilise des ateliers ludiques (Lego Scrum, jeux agiles) pour une expérience d\'apprentissage immersive et mémorable.',
    categorie: 'Gestion de projet',
    duree: '2 jours (16 heures)',
    prix: '900 000 FCFA',
    certifiante: true,
    certificationName: 'Préparation et passage de la certification Professional Scrum Master (PSM I - Scrum.org)',
    modalite: 'Présentiel immersif avec jeux agiles',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop',
    objectif: 'Comprendre en profondeur la philosophie agile et le Manifeste Agile. Maîtriser la théorie Scrum : empirisme, transparence, inspection, adaptation. Connaître les rôles Scrum (Scrum Master, Product Owner, Développeurs) et leurs responsabilités. Maîtriser les artefacts Scrum et leurs engagements (Product Backlog, Sprint Backlog, Incrément). Animer avec brio les 5 événements Scrum (Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective). Développer les compétences de coaching d\'équipe et de facilitation. Éliminer efficacement les obstacles (impediments) pour l\'équipe. Réussir l\'examen PSM I (80 questions, 60 minutes, 85% pass mark) avec stratégies de réponse et entraînement intensif.',
    prerequis: 'Intérêt pour la gestion collaborative et la conduite de projets agiles. Expérience en gestion de projet ou développement logiciel recommandée mais non obligatoire. Ouverture aux méthodes de travail agiles.',
    publicCible: 'Scrum Masters débutants ou confirmés, Chefs de projet en transition agile, Développeurs, Product Owners, Membres d\'équipes agiles, Professionnels souhaitant devenir facilitateurs agiles.',
    modules: [
      'Module 1 : Origine et philosophie du Manifeste Agile - 4 valeurs, 12 principes, transition agile, mindset agile',
      'Module 2 : Théorie Scrum - Empirisme, 3 piliers (transparence, inspection, adaptation), 5 valeurs Scrum',
      'Module 3 : Rôles Scrum - Scrum Master (servant leader), Product Owner (value maximizer), Développeurs (cross-functional team)',
      'Module 4 : Artefacts Scrum et engagements - Product Backlog, Sprint Backlog, Incrément, Definition of Done, Definition of Ready',
      'Module 5 : Événements Scrum - Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective, timeboxing et facilitation',
      'Module 6 : Coaching et simulation - Coaching d\'équipe, facilitation avancée, simulation projet en sprints, entraînement examen PSM I'
    ],
    pointsForts: [
      'Pédagogie active basée sur des ateliers ludiques (Lego Scrum, jeux agiles, simulations)',
      'Certification Scrum.org reconnue à vie sans frais de renouvellement annuel',
      'Conseils concrets et outils pratiques pour réussir la transition agile en entreprise',
      'Préparation complète à l\'examen PSM I avec mock exams et analyse des pièges'
    ]
  },
  {
    id: 'audit-financier-controle-gestion',
    titre: 'Audit Financier, Contrôle de Gestion & Cartographie des Risques',
    description: 'Cette formation spécialisée de 4 jours permet de renforcer la fiabilité des comptes, de sécuriser les procédures internes et de piloter la performance financière avec des tableaux de bord prédictifs. Dans un environnement réglementaire de plus en plus strict (OHADA, IFRS, SOX, compliance), la maîtrise des méthodologies d\'audit financier, du contrôle de gestion et de la cartographie des risques devient essentielle pour les organisations. Vous développerez des compétences pratiques en audit comptable et financier, révision comptable, échantillonnage statistique, et conception de tableaux de bord de gestion. Notre approche combine théorie avancée, études de cas réels et travaux pratiques sur tableurs financiers avancés avec modèles réutilisables. L\'intervenant est un expert-comptable diplômé et auditeur chevronné avec une expérience terrain en contexte africain et international.',
    categorie: 'Filières métiers',
    duree: '4 jours (28 heures)',
    prix: '1 400 000 FCFA',
    certifiante: true,
    certificationName: 'Certificat Professionnel Conseilux Finance & Risk Management',
    modalite: 'Présentiel & Études de cas réels',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    objectif: 'Maîtriser la méthodologie d\'audit comptable et financier selon les normes internationales. Comprendre et appliquer les normes d\'audit financier et la démarche d\'évaluation du contrôle interne. Développer des compétences en techniques de révision comptable et d\'échantillonnage statistique. Apprendre à élaborer la cartographie des risques financiers et opérationnels de l\'organisation. Concevoir des tableaux de bord de gestion pertinents et piloter les KPIs stratégiques. Sécuriser les processus de gouvernance financière et assurer la conformité réglementaire. Maîtriser les techniques de clôture des comptes, communication financière et rédaction de rapports d\'audit professionnels.',
    prerequis: 'Connaissances solides en comptabilité générale et gestion financière. Expérience en finance, comptabilité ou contrôle de gestion recommandée. Compréhension des principes comptables et des états financiers.',
    publicCible: 'Directeurs administratifs et financiers (DAF), Contrôleurs de gestion, Auditeurs internes, Experts-comptables stagiaires, Trésoriers, Responsables financiers, Professionnels finance en transition vers des rôles d\'audit ou contrôle.',
    modules: [
      'Module 1 : Normes d\'audit financier et évaluation du contrôle interne - Normes internationales, démarche d\'audit, évaluation risques, contrôle interne',
      'Module 2 : Techniques de révision comptable et échantillonnage - Procédures d\'audit, tests de substantiation, échantillonnage statistique, documentation',
      'Module 3 : Cartographie des risques financiers et opérationnels - Identification risques, analyse impact/probabilité, mitigation, reporting',
      'Module 4 : Tableaux de bord de gestion et pilotage KPIs - Conception dashboards, indicateurs financiers, reporting management, analyse variance',
      'Module 5 : Clôture des comptes et communication financière - Procédures clôture, états financiers, notes annexes, rapports d\'audit, communication stakeholders'
    ],
    pointsForts: [
      'Cas pratiques sur tableurs financiers avancés avec modèles réutilisables et templates personnalisables',
      'Intervenant expert-comptable diplômé et auditeur chevronné avec expérience terrain africaine et internationale',
      'Approche pragmatique orientée conformité OHADA et normes IFRS avec cas d\'entreprises réels',
      'Matériel complet incluant checklists d\'audit, modèles de rapports et frameworks de cartographie des risques'
    ]
  }
]

export function getFormationImage(formation: { image?: string; categorie?: string; titre?: string }): string {
  if (formation.image && formation.image.startsWith('http')) {
    return formation.image
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
