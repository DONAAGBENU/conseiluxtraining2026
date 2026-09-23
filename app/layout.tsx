import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from './components/LanguageProvider'
import { ThemeProvider } from './components/ThemeProvider'
import AnalyticsTracker from './components/AnalyticsTracker'

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
    icon: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/favicon.jpg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('conseilux_theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} ${poppins.variable} bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 antialiased min-h-screen transition-colors duration-200`}>
        <ThemeProvider>
          <LanguageProvider>
            <AnalyticsTracker />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}