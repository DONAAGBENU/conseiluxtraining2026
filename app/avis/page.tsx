import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { Star, User, Building, Calendar } from 'lucide-react'

export default function Avis() {
  const allTestimonials = [
    {
      name: 'Marie Kouassi',
      role: 'Directrice RH',
      company: 'Groupe SIB',
      text: "Grâce à ConseiluxTraining, nous avons certifié 50 collaborateurs en gestion de projet. Un accompagnement professionnel et des résultats exceptionnels. Leur expertise a transformé notre approche de la formation.",
      rating: 5,
      date: '15 mai 2024'
    },
    {
      name: 'Jean Adé',
      role: 'CEO',
      company: 'Tech Solutions Africa',
      text: "La formation en cybersécurité a transformé notre approche de la sécurité. Nos équipes sont désormais certifiées et opérationnelles. Je recommande vivement leurs services.",
      rating: 5,
      date: '12 avril 2024'
    },
    {
      name: 'Fatima Diallo',
      role: 'Responsable Formation',
      company: 'Groupe BIA',
      text: "Un partenaire de confiance qui comprend nos enjeux. Les formations TOEIC ont permis à nos équipes d'atteindre leurs objectifs. Une équipe compétente et disponible.",
      rating: 5,
      date: '28 mars 2024'
    },
    {
      name: 'Koffi Amoussou',
      role: 'Directeur des Opérations',
      company: 'Logistics Express',
      text: "La formation en Lean Six Sigma a permis d'optimiser nos processus. Des résultats concrets et mesurables. Je suis très satisfait de la qualité des formations.",
      rating: 5,
      date: '10 février 2024'
    },
    {
      name: 'Amina Touré',
      role: 'Chef de Projet',
      company: 'Agence Digital Plus',
      text: "La préparation PMP avec ConseiluxTraining m'a permis d'obtenir ma certification du premier coup. Les formateurs sont d'une grande qualité pédagogique.",
      rating: 5,
      date: '25 janvier 2024'
    },
    {
      name: 'Souleymane Diarra',
      role: 'Directeur Général',
      company: 'Groupe MINES',
      text: "Des formations adaptées aux besoins de notre industrie. La flexibilité et la qualité des prestations font de ConseiluxTraining un partenaire de choix.",
      rating: 5,
      date: '05 décembre 2023'
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-r from-primary to-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Avis Clients</h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Ce que nos clients disent de leurs expériences avec ConseiluxTraining
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allTestimonials.map((testimonial, index) => (
                <div key={index} className="card border-t-4 border-orange-600 hover:-translate-y-1 transition-all">
                  <div className="flex text-orange-600 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic line-clamp-4">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{testimonial.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{testimonial.role}</span>
                          <span>•</span>
                          <span>{testimonial.company}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {testimonial.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}