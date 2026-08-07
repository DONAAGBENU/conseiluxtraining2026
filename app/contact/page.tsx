import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'

export default function Contact() {
  const offices = [
    {
      city: 'Cotonou',
      country: 'Bénin',
      phone: '+229 01 29 23 91 94',
      address: 'Cotonou, Bénin'
    },
    {
      city: 'Lomé',
      country: 'Togo',
      phone: '+228 90 54 64 64',
      address: 'Lomé, Togo'
    },
    {
      city: 'Abidjan',
      country: 'Côte d\'Ivoire',
      phone: '+225 07 58 97 03 44',
      address: 'Abidjan, Côte d\'Ivoire'
    },
    {
      city: 'Niamey',
      country: 'Niger',
      phone: '+227 82 64 86 04',
      address: 'Niamey, Niger'
    },
    {
      city: 'Paris',
      country: 'France',
      phone: '+33 7 456 441 81',
      address: 'Paris, France'
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-r from-primary to-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contactez-nous</h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              Nous sommes à votre écoute pour répondre à vos besoins
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Formulaire */}
              <div className="card border-t-4 border-orange-600">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Envoyez-nous un message</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom et Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none"
                      placeholder="Votre nom complet"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none"
                      placeholder="+229 01 23 45 67"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sujet
                    </label>
                    <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none">
                      <option value="">Sélectionnez un sujet</option>
                      <option value="formation">Demande de formation</option>
                      <option value="conseil">Conseil stratégique</option>
                      <option value="recrutement">Recrutement</option>
                      <option value="catalogue">Télécharger catalogue</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600 outline-none"
                      placeholder="Décrivez votre demande..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Envoyer le message
                  </button>
                </form>
              </div>

              {/* Informations de contact */}
              <div className="space-y-6">
                <div className="card border-t-4 border-orange-600">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Nos Bureaux</h3>
                  <div className="space-y-4">
                    {offices.map((office, index) => (
                      <div key={index} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                        <h4 className="font-semibold text-slate-900">{office.city}, {office.country}</h4>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-orange-600" />
                          {office.phone}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-orange-600" />
                          {office.address}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card bg-orange-50 border-2 border-orange-600/20">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Informations Générales</h3>
                  <div className="space-y-3">
                    <p className="flex items-center gap-3 text-sm">
                      <Mail className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <span>contact@conseiluxtraining.com</span>
                    </p>
                    <p className="flex items-center gap-3 text-sm">
                      <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <span>Lundi - Vendredi : 8h00 - 18h00</span>
                    </p>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        📍 Présence multi-pays : Bénin, Togo, Côte d'Ivoire, Niger, France
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}