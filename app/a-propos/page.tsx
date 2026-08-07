import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export default function APropos() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">À propos</h1>
        <p className="text-gray-600">
          Découvrez l'histoire et les valeurs de ConseiluxTraining.
        </p>
      </main>
      <Footer />
    </div>
  )
}