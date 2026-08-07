import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Link from 'next/link'

export default function Evaluation() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Évaluation de Niveau Gratuite
          </h1>
          <p className="text-xl text-center text-gray-600 mb-12">
            Complétez ce formulaire et nous vous contacterons pour organiser votre test
          </p>
          
          <form className="bg-white shadow-lg rounded-xl p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="Votre nom et prénom"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="votre@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input 
                type="tel" 
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quel examen préparez-vous ? *
              </label>
              <select className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
                <option value="">Sélectionnez un examen</option>
                <option value="toeic">TOEIC</option>
                <option value="toefl">TOEFL</option>
                <option value="gre">GRE</option>
                <option value="other">Autre / Cours d&apos;anglais général</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau d&apos;anglais actuel
              </label>
              <select className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
                <option value="">Sélectionnez votre niveau</option>
                <option value="debutant">Débutant (A1-A2)</option>
                <option value="intermediaire">Intermédiaire (B1-B2)</option>
                <option value="avance">Avancé (C1-C2)</option>
                <option value="incertain">Je ne sais pas</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objectifs
              </label>
              <textarea 
                rows={4}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="Décrivez vos objectifs et vos attentes..."
              ></textarea>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-lg"
            >
              Demander mon évaluation gratuite
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}