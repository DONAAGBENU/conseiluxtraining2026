// lib/languageCenterTranslations.ts
// Traductions FR / EN pour le Centre de Langues (Conseilux Language Academy)

export type LCLanguage = 'fr' | 'en';

export const lcTranslations = {
  fr: {
    // Header navigation
    nav: {
      home: 'Accueil',
      programmes: 'Programmes',
      inscription: 'Inscription',
      certifications: 'Certifications',
      backToSite: 'Retour au site',
    },
    // Dark mode
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair',

    // Hero section
    hero: {
      badge: 'Conseilux Language Academy',
      title1: 'Apprendre.',
      title2: 'Certifier. S\'ouvrir au monde.',
      subtitle:
        'De la formation linguistique à la certification internationale — un parcours structuré, du positionnement A1 jusqu\'à la mobilité internationale.',
      ctaAdmission: 'Voir les admissions',
      ctaBack: '← Retour à Conseilux Training',
    },

    // 5 Pôles
    poles: {
      sectionTitle: 'Un écosystème, pas un simple cours',
      sectionSubtitle:
        'Cinq pôles complémentaires qui accompagnent l\'apprenant de l\'inscription jusqu\'à la mobilité internationale.',
      items: [
        {
          n: '01',
          title: 'Language Programs',
          desc: 'Formation linguistique structurée, du niveau A1 au niveau C1, avec évaluation à chaque palier.',
        },
        {
          n: '02',
          title: 'Professional English',
          desc: 'Business English, English for Managers, Finance, HR, IT, Project Management.',
        },
        {
          n: '03',
          title: 'International Exam Preparation',
          desc: 'Préparation TOEIC, TOEFL, IELTS, GRE — stratégie d\'examen et tests blancs chronométrés.',
        },
        {
          n: '04',
          title: 'International Exam Center',
          desc: 'Passage des examens selon habilitations et partenariats disponibles.',
        },
        {
          n: '05',
          title: 'International Language Immersion',
          desc: 'Séjours linguistiques UK, USA, Canada, Malte, Afrique du Sud — formules 2 semaines à 1 mois.',
        },
      ],
    },

    // Programme phare
    flagship: {
      label: 'Programme phare',
      title: 'Conseilux English Master — 09 mois',
      subtitle:
        'Test de positionnement, formation générale et professionnelle, préparation TOEIC et attestation de fin de formation.',
      trimesters: [
        {
          n: 'T1',
          title: 'Foundation',
          duree: '3 mois',
          items: ['Grammaire fondamentale', 'Vocabulaire', 'Compréhension orale', 'Communication quotidienne'],
        },
        {
          n: 'T2',
          title: 'Communication',
          duree: '3 mois',
          items: ['Anglais professionnel', 'Réunions & présentations', 'Correspondance', 'Négociation'],
        },
        {
          n: 'T3',
          title: 'Performance & Certification',
          duree: '3 mois',
          items: ['Préparation intensive TOEIC', 'Tests blancs', "Stratégie d'examen", 'Entraînement chronométré'],
        },
      ],
    },

    // Admission
    admission: {
      sectionTitle: 'Admissions — Programme 2026–2027',
      sectionSubtitle: 'Un vrai processus d\'admission, du dossier jusqu\'à la graduation.',
      steps: [
        'Inscription — le candidat remplit son dossier',
        'Test de positionnement — écrit + oral',
        'Attribution du niveau (A1 → C1)',
        'Inscription dans un parcours',
        'Formation — cours, pratique, évaluations',
        'Évaluation intermédiaire',
        'Préparation certification (TOEIC / TOEFL / IELTS)',
        'Examen international',
        'Graduation — attestation + résultat officiel',
      ],
      ctaTitle: 'Prêt à démarrer votre parcours ?',
      ctaSubtitle: 'Réservez votre test de positionnement pour la Promotion 2026–2027.',
      ctaButton: 'Nous contacter',
    },

    // Programmes page
    programmesPage: {
      back: '← Conseilux Language Academy',
      title: 'Catalogue des',
      titleItalic: 'programmes',
      subtitle: 'Cinq parcours nommés, du niveau A1 à la mobilité internationale.',
      requestQuote: 'Demander un devis',
      noPrograms: 'Aucun programme disponible pour le moment.',
    },

    // Inscription page
    inscriptionPage: {
      title: 'Inscription & vie académique',
      subtitle: 'Ce qu\'il faut pour s\'inscrire, les règles qui encadrent la formation, et la manière dont la progression est évaluée et attestée.',
      documentsTitle: 'Dossier d\'inscription',
      documentsSubtitle: 'Documents à fournir avant le test de positionnement.',
      documents: [
        'Formulaire d\'inscription complété',
        'Copie d\'une pièce d\'identité',
        'Une photo d\'identité',
        'Frais de dossier (test de positionnement)',
      ],
      reglementTitle: 'Règlement intérieur',
      reglementSubtitle: 'Base à adapter selon les usages internes de Conseilux — modifie librement le contenu de chaque point.',
      reglement: [
        {
          title: 'Assiduité',
          text: 'Présence obligatoire aux séances. Un seuil d\'absences non justifiées peut entraîner un avertissement ou une reprise de niveau.',
        },
        {
          title: 'Ponctualité',
          text: 'Les retards répétés perturbent le groupe et sont consignés dans le dossier pédagogique de l\'apprenant.',
        },
        {
          title: 'Évaluations',
          text: 'La participation aux évaluations trimestrielles est obligatoire pour valider le passage au niveau suivant.',
        },
        {
          title: 'Comportement',
          text: 'Respect mutuel entre apprenants et formateurs ; usage du français/anglais encouragé selon les consignes du cours.',
        },
        {
          title: 'Matériel',
          text: 'Chaque apprenant est responsable du matériel pédagogique qui lui est confié (supports, accès plateforme, etc.).',
        },
      ],
      evaluationTitle: 'Système d\'évaluation et de notation',
      evaluationSubtitle: 'Barème sur 20, appliqué aux évaluations trimestrielles pour valider le passage au niveau suivant.',
      bareme: [
        { plage: '16 – 20', mention: 'Excellent — passage de niveau confirmé' },
        { plage: '12 – 15,9', mention: 'Satisfaisant — passage de niveau' },
        { plage: '10 – 11,9', mention: 'Passable — passage sous condition' },
        { plage: '< 10', mention: 'Insuffisant — reprise du niveau recommandée' },
      ],
      progressDossier: 'Dossier pédagogique',
      progressTitle: 'Relevé de progression linguistique',
      progressItems: [
        'Niveau initial',
        'Niveau actuel',
        'Compétences acquises',
        'Score aux évaluations',
        'Assiduité',
        'Recommandations du formateur',
      ],
      progressNote: 'Remis périodiquement à chaque apprenant.',
      attestationTitle: 'Modèle d\'attestation',
      attestationSubtitle: 'Deux éléments distincts, remis séparément à la fin du parcours.',
      attestation1Title: 'Attestation de fin de formation Conseilux',
      attestation1Desc: 'Délivrée par Conseilux Language Academy — atteste du suivi complet du parcours et du niveau atteint en interne.',
      attestation2Title: 'Score / certificat TOEIC',
      attestation2Desc: 'Délivré par l\'organisme habilité, lorsque l\'apprenant passe effectivement l\'examen — élément distinct de l\'attestation Conseilux.',
      seePrograms: 'Voir les programmes',
    },

    // Certifications page
    certificationsPage: {
      title: 'Certifications internationales',
      subtitle: 'De la préparation à l\'examen, jusqu\'à la mobilité — formation, certification et immersion sont clairement distinctes dans notre parcours.',
      examCenterTitle: 'English Certification Center',
      examCenterSubtitle: 'Préparation aux examens internationaux, selon vos objectifs.',
      examens: [
        { code: 'TOEIC', desc: 'Anglais professionnel — le plus demandé en entreprise' },
        { code: 'TOEFL', desc: 'Anglais académique — études supérieures à l\'étranger' },
        { code: 'IELTS', desc: 'Anglais international — études, travail, immigration' },
        { code: 'GRE', desc: 'Selon partenariats et habilitations disponibles' },
      ],
      examNote: 'Formation, préparation, passage de l\'examen et certification/résultat officiel restent quatre étapes distinctes dans notre communication.',
      pipelineTitle: 'Formation → Préparation → Examen → Certification',
      pipeline: [
        'Formation 09 mois',
        'Préparation TOEIC',
        'Examen TOEIC',
        'Score TOEIC',
        'Attestation Conseilux',
        'Employabilité / mobilité',
      ],
      progressionTitle: 'Grille de progression par niveau',
      tableNiveau: 'Niveau',
      tableDuree: 'Durée indicative',
      tableValidation: 'Validation',
      progression: [
        { niveau: 'A1', duree: '3 mois', validation: 'Évaluation A1' },
        { niveau: 'A2', duree: '3 mois', validation: 'Évaluation A2' },
        { niveau: 'B1', duree: '3 mois', validation: 'Évaluation B1' },
        { niveau: 'B2', duree: '3 mois', validation: 'Évaluation B2' },
        { niveau: 'C1', duree: '3 à 6 mois', validation: 'Évaluation C1' },
      ],
      sejourPremium: 'Option premium',
      sejourTitle: 'Conseilux International Language Immersion',
      sejourSubtitle: 'Selon les partenaires et destinations disponibles au moment de l\'inscription.',
      destinations: [
        { flag: '🇬🇧', pays: 'Royaume-Uni' },
        { flag: '🇺🇸', pays: 'États-Unis' },
        { flag: '🇨🇦', pays: 'Canada' },
        { flag: '🇲🇹', pays: 'Malte' },
        { flag: '🇿🇦', pays: 'Afrique du Sud' },
      ],
      formules: [
        { nom: '2 semaines', desc: 'Formation + immersion + activités culturelles' },
        { nom: '1 mois', desc: 'Formation intensive + immersion' },
        { nom: 'Summer', desc: 'Pour étudiants et jeunes professionnels' },
        { nom: 'Business Immersion', desc: 'Pour cadres et dirigeants' },
      ],
      contactButton: 'Demander des informations',
      testLevelButton: 'Test de Niveau',
    },

    // Test de niveau page
    testLevelPage: {
      title: 'Test de Niveau en Anglais',
      subtitle: 'Évaluez votre niveau d\'anglais avec notre test complet professionnel : Grammar, Reading, Listening, Writing et Speaking',
      startButton: 'Commencer le Test',
      formTitle: 'Informations Personnelles',
      formSubtitle: 'Veuillez remplir vos coordonnées avant de commencer le test',
      nameLabel: 'Nom complet',
      emailLabel: 'Email',
      phoneLabel: 'Téléphone',
      countryLabel: 'Pays',
      cityLabel: 'Ville',
      companyLabel: 'Entreprise (optionnel)',
      startTest: 'Commencer le Test',
      sections: {
        reading: 'Reading',
        listening: 'Listening',
        writing: 'Writing',
        speaking: 'Speaking',
      },
      reading: {
        title: 'Section Reading',
        description: 'Lisez les textes et répondez aux questions',
        submit: 'Soumettre les réponses',
      },
      listening: {
        title: 'Section Listening',
        description: 'Écoutez les enregistrements et répondez aux questions',
        play: 'Écouter',
        pause: 'Pause',
        submit: 'Soumettre les réponses',
      },
      writing: {
        title: 'Section Writing',
        description: 'Rédigez vos réponses dans les temps impartis',
        timeRemaining: 'Temps restant',
        submit: 'Soumettre votre réponse',
        tasks: {
          email: 'Tâche 1: Email professionnel',
          building: 'Tâche 2: Sujet académique',
          discussion: 'Tâche 3: Discussion académique',
        },
      },
      results: {
        title: 'Résultats du Test',
        description: 'Voici vos résultats et votre niveau évalué',
        score: 'Score Total',
        level: 'Niveau Évalué',
        breakdown: 'Détail par Section',
        readingScore: 'Reading',
        listeningScore: 'Listening',
        writingScore: 'Writing',
        submitToAdmin: 'Soumettre à l\'administrateur',
        submitted: 'Test soumis avec succès !',
        downloadResults: 'Télécharger les résultats',
      },
    },
  },

  en: {
    // Header navigation
    nav: {
      home: 'Home',
      programmes: 'Programs',
      inscription: 'Enrollment',
      certifications: 'Certifications',
      backToSite: 'Back to main site',
    },
    // Dark mode
    darkMode: 'Dark mode',
    lightMode: 'Light mode',

    // Hero section
    hero: {
      badge: 'Conseilux Language Academy',
      title1: 'Learn.',
      title2: 'Get Certified. Open to the World.',
      subtitle:
        'From language training to international certification — a structured path, from A1 placement all the way to international mobility.',
      ctaAdmission: 'View admissions',
      ctaBack: '← Back to Conseilux Training',
    },

    // 5 Poles
    poles: {
      sectionTitle: 'An ecosystem, not just a course',
      sectionSubtitle:
        'Five complementary pillars that accompany the learner from enrollment to international mobility.',
      items: [
        {
          n: '01',
          title: 'Language Programs',
          desc: 'Structured language training from A1 to C1, with assessment at each stage.',
        },
        {
          n: '02',
          title: 'Professional English',
          desc: 'Business English, English for Managers, Finance, HR, IT, Project Management.',
        },
        {
          n: '03',
          title: 'International Exam Preparation',
          desc: 'TOEIC, TOEFL, IELTS, GRE preparation — exam strategy and timed mock tests.',
        },
        {
          n: '04',
          title: 'International Exam Center',
          desc: 'Exam sittings available subject to accreditations and partnerships.',
        },
        {
          n: '05',
          title: 'International Language Immersion',
          desc: 'Language stays in the UK, USA, Canada, Malta, South Africa — 2-week to 1-month packages.',
        },
      ],
    },

    // Flagship programme
    flagship: {
      label: 'Flagship program',
      title: 'Conseilux English Master — 9 months',
      subtitle:
        'Placement test, general and professional training, TOEIC preparation and end-of-course certificate.',
      trimesters: [
        {
          n: 'T1',
          title: 'Foundation',
          duree: '3 months',
          items: ['Core grammar', 'Vocabulary', 'Listening comprehension', 'Everyday communication'],
        },
        {
          n: 'T2',
          title: 'Communication',
          duree: '3 months',
          items: ['Professional English', 'Meetings & presentations', 'Correspondence', 'Negotiation'],
        },
        {
          n: 'T3',
          title: 'Performance & Certification',
          duree: '3 months',
          items: ['Intensive TOEIC prep', 'Mock tests', 'Exam strategy', 'Timed practice'],
        },
      ],
    },

    // Admission
    admission: {
      sectionTitle: 'Admissions — 2026–2027 Program',
      sectionSubtitle: 'A real admission process, from application to graduation.',
      steps: [
        'Application — candidate fills in their file',
        'Placement test — written + oral',
        'Level assignment (A1 → C1)',
        'Enrollment in a track',
        'Training — classes, practice, assessments',
        'Mid-course evaluation',
        'Certification preparation (TOEIC / TOEFL / IELTS)',
        'International exam',
        'Graduation — certificate + official result',
      ],
      ctaTitle: 'Ready to start your journey?',
      ctaSubtitle: 'Book your placement test for the 2026–2027 cohort.',
      ctaButton: 'Contact Us',
    },

    // Programmes page
    programmesPage: {
      back: '← Conseilux Language Academy',
      title: 'Course',
      titleItalic: 'catalogue',
      subtitle: 'Five named tracks, from A1 level to international mobility.',
      requestQuote: 'Request a quote',
      noPrograms: 'No programs available at the moment.',
    },

    // Inscription page
    inscriptionPage: {
      title: 'Enrollment & Academic Life',
      subtitle: 'What you need to enroll, the rules that govern the training, and how progress is evaluated and certified.',
      documentsTitle: 'Enrollment File',
      documentsSubtitle: 'Documents to provide before the placement test.',
      documents: [
        'Completed enrollment form',
        'Copy of ID',
        'ID photo',
        'Application fee (placement test)',
      ],
      reglementTitle: 'Internal Rules',
      reglementSubtitle: 'Base to adapt according to Conseilux internal practices — freely modify the content of each point.',
      reglement: [
        {
          title: 'Attendance',
          text: 'Mandatory attendance at sessions. A threshold of unexcused absences may lead to a warning or level repetition.',
        },
        {
          title: 'Punctuality',
          text: 'Repeated lateness disrupts the group and is recorded in the learner\'s academic file.',
        },
        {
          title: 'Assessments',
          text: 'Participation in quarterly assessments is mandatory to validate progression to the next level.',
        },
        {
          title: 'Behavior',
          text: 'Mutual respect between learners and trainers; use of French/English encouraged according to course instructions.',
        },
        {
          title: 'Materials',
          text: 'Each learner is responsible for the educational materials entrusted to them (supports, platform access, etc.).',
        },
      ],
      evaluationTitle: 'Evaluation and Grading System',
      evaluationSubtitle: '20-point scale, applied to quarterly assessments to validate progression to the next level.',
      bareme: [
        { plage: '16 – 20', mention: 'Excellent — level progression confirmed' },
        { plage: '12 – 15.9', mention: 'Satisfactory — level progression' },
        { plage: '10 – 11.9', mention: 'Passable — conditional progression' },
        { plage: '< 10', mention: 'Insufficient — level repetition recommended' },
      ],
      progressDossier: 'Academic File',
      progressTitle: 'Language Progress Report',
      progressItems: [
        'Initial level',
        'Current level',
        'Acquired skills',
        'Assessment scores',
        'Attendance',
        'Trainer recommendations',
      ],
      progressNote: 'Provided periodically to each learner.',
      attestationTitle: 'Certificate Model',
      attestationSubtitle: 'Two distinct elements, provided separately at the end of the track.',
      attestation1Title: 'Conseilux End-of-Training Certificate',
      attestation1Desc: 'Issued by Conseilux Language Academy — attests to complete track completion and internally achieved level.',
      attestation2Title: 'TOEIC Score / Certificate',
      attestation2Desc: 'Issued by the authorized organization when the learner actually takes the exam — distinct element from the Conseilux certificate.',
      seePrograms: 'View programs',
    },

    // Certifications page
    certificationsPage: {
      title: 'International Certifications',
      subtitle: 'From preparation to exam, to mobility — training, certification, and immersion are clearly distinct in our track.',
      examCenterTitle: 'English Certification Center',
      examCenterSubtitle: 'Preparation for international exams, according to your objectives.',
      examens: [
        { code: 'TOEIC', desc: 'Professional English — most demanded in companies' },
        { code: 'TOEFL', desc: 'Academic English — higher education abroad' },
        { code: 'IELTS', desc: 'International English — studies, work, immigration' },
        { code: 'GRE', desc: 'According to available partnerships and accreditations' },
      ],
      examNote: 'Training, preparation, exam taking, and certification/official result remain four distinct steps in our communication.',
      pipelineTitle: 'Training → Preparation → Exam → Certification',
      pipeline: [
        '09-month Training',
        'TOEIC Preparation',
        'TOEIC Exam',
        'TOEIC Score',
        'Conseilux Certificate',
        'Employability / mobility',
      ],
      progressionTitle: 'Progression Grid by Level',
      tableNiveau: 'Level',
      tableDuree: 'Indicative Duration',
      tableValidation: 'Validation',
      progression: [
        { niveau: 'A1', duree: '3 months', validation: 'A1 Assessment' },
        { niveau: 'A2', duree: '3 months', validation: 'A2 Assessment' },
        { niveau: 'B1', duree: '3 months', validation: 'B1 Assessment' },
        { niveau: 'B2', duree: '3 months', validation: 'B2 Assessment' },
        { niveau: 'C1', duree: '3 to 6 months', validation: 'C1 Assessment' },
      ],
      sejourPremium: 'Premium option',
      sejourTitle: 'Conseilux International Language Immersion',
      sejourSubtitle: 'According to partners and destinations available at the time of enrollment.',
      destinations: [
        { flag: '🇬🇧', pays: 'United Kingdom' },
        { flag: '🇺🇸', pays: 'United States' },
        { flag: '🇨🇦', pays: 'Canada' },
        { flag: '🇲🇹', pays: 'Malta' },
        { flag: '🇿🇦', pays: 'South Africa' },
      ],
      formules: [
        { nom: '2 weeks', desc: 'Training + immersion + cultural activities' },
        { nom: '1 month', desc: 'Intensive training + immersion' },
        { nom: 'Summer', desc: 'For students and young professionals' },
        { nom: 'Business Immersion', desc: 'For executives and managers' },
      ],
      contactButton: 'Request information',
      testLevelButton: 'Level Test',
    },

    // Test de niveau page
    testLevelPage: {
      title: 'English Level Test',
      subtitle: 'Assess your English level with our comprehensive professional test: Grammar, Reading, Listening, Writing and Speaking',
      startButton: 'Start Test',
      formTitle: 'Personal Information',
      formSubtitle: 'Please fill in your details before starting the test',
      nameLabel: 'Full Name',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      countryLabel: 'Country',
      cityLabel: 'City',
      companyLabel: 'Company (optional)',
      startTest: 'Start Test',
      sections: {
        reading: 'Reading',
        listening: 'Listening',
        writing: 'Writing',
        speaking: 'Speaking',
      },
      reading: {
        title: 'Reading Section',
        description: 'Read the texts and answer the questions',
        submit: 'Submit Answers',
      },
      listening: {
        title: 'Listening Section',
        description: 'Listen to the recordings and answer the questions',
        play: 'Play',
        pause: 'Pause',
        submit: 'Submit Answers',
      },
      writing: {
        title: 'Writing Section',
        description: 'Write your answers within the allotted time',
        timeRemaining: 'Time Remaining',
        submit: 'Submit Your Answer',
        tasks: {
          email: 'Task 1: Professional Email',
          building: 'Task 2: Academic Topic',
          discussion: 'Task 3: Academic Discussion',
        },
      },
      results: {
        title: 'Test Results',
        description: 'Here are your results and your assessed level',
        score: 'Total Score',
        level: 'Assessed Level',
        breakdown: 'Section Breakdown',
        readingScore: 'Reading',
        listeningScore: 'Listening',
        writingScore: 'Writing',
        submitToAdmin: 'Submit to Administrator',
        submitted: 'Test submitted successfully!',
        downloadResults: 'Download Results',
      },
    },
  },
} as const;
