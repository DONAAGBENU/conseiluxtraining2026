// Cette page redirige vers le dashboard admin du centre de langues
// L'utilisateur peut y accéder en tapant /centre-de-langues/admin
import { redirect } from 'next/navigation'

export default function LanguageAdminRedirect() {
  redirect('/centre-de-langues/admin/dashboard')
}
