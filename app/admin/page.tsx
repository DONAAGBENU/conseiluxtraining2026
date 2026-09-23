// Cette page redirige vers le tableau de bord admin
// L'utilisateur peut y accéder en tapant /admin sur le site principal
import { redirect } from 'next/navigation'

export default function AdminRedirect() {
  redirect('/admin/dashboard')
}
