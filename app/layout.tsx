import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from './components/LanguageProvider'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'ConseiluxTraining & Development - Formation, Conseil, Recrutement',
  description: 'Cabinet de conseil spécialisé en conseil stratégique, formation professionnelle, développement des compétences et recrutement sur mesure.',
  keywords: 'formation, conseil, recrutement, certification, TOEIC, TOEFL, GRE, management, leadership, cybersécurité',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className={`${inter.className} ${poppins.variable}`}>
        <div className="relative min-h-screen">
          <div
            className="fixed inset-0 -z-20 bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: "url('https://plus.unsplash.com/premium_photo-1725400817468-ddb0135d865d?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            }}
          />

          <div className="fixed inset-0 -z-10 bg-blue-900/90" />

          <div className="relative">
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </div>
        </div>
      </body>
    </html>
  )
}