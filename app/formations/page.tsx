import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export default function Formations() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Nos formations</h1>
        <p className="text-gray-600">
          Découvrez notre catalogue de formations professionnelles.
        </p>
      </main>
      <Footer />
    </div>
  )
}